"""
Authentication API Endpoints
Magic Link Email Authentication
"""
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr
from typing import Optional
import logging

from app.core.database import get_db
from app.services.auth_service import auth_service

logger = logging.getLogger(__name__)
router = APIRouter()


# ============== Pydantic Schemas ==============

class LoginRequest(BaseModel):
    """Request magic link"""
    email: EmailStr


class VerifyRequest(BaseModel):
    """Verify magic link token"""
    email: EmailStr
    token: str


class SessionResponse(BaseModel):
    """Session/user data response"""
    user_id: str
    email: str
    name: Optional[str]
    session_token: str
    expires_at: str
    onboarding_complete: bool


class UserResponse(BaseModel):
    """User profile response"""
    user_id: str
    email: str
    name: Optional[str]
    agent_email: Optional[str]  # ✅ BATCH 1.2: Agent email for digital mailbox
    onboarding_complete: bool


# ============== Helper: Get Current User ==============

async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> dict:
    """
    Dependency to get current authenticated user
    Checks session token from Authorization header or cookie
    """
    # Try Authorization header first
    auth_header = request.headers.get("Authorization")
    session_token = None
    
    if auth_header and auth_header.startswith("Bearer "):
        session_token = auth_header.replace("Bearer ", "")
    else:
        # Try cookie
        session_token = request.cookies.get("session_token")
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_data = await auth_service.verify_session(session_token, db)
    
    if not user_data:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    return user_data


# ============== Auth Endpoints ==============

@router.post("/login")
async def request_magic_link(
    request: LoginRequest,
    req: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Request a magic link to be sent to email
    
    This endpoint:
    1. Creates user if doesn't exist
    2. Generates secure magic link token
    3. Sends email with magic link
    
    Returns success even if email doesn't exist (security: don't reveal registered emails)
    """
    # Get base URL from request or environment
    base_url = req.headers.get("Origin") or "https://app.forbrugeragent.dk"
    
    try:
        success = await auth_service.request_magic_link(
            email=request.email,
            base_url=base_url,
            db=db
        )
        
        # Always return success (security: don't reveal if email exists)
        return {
            "success": True,
            "message": "Hvis email eksisterer, er et login link sendt. Tjek din indbakke."
        }
        
    except Exception as e:
        logger.error(f"❌ Login request failed: {str(e)}")
        # Still return success to user (don't reveal errors)
        return {
            "success": True,
            "message": "Hvis email eksisterer, er et login link sendt. Tjek din indbakke."
        }


@router.post("/verify", response_model=SessionResponse)
async def verify_magic_link(
    request: VerifyRequest,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    """
    Verify magic link token and create session
    
    This endpoint:
    1. Validates the magic link token
    2. Creates a session
    3. Returns session token
    """
    result = await auth_service.verify_magic_link(
        email=request.email,
        token=request.token,
        db=db
    )
    
    if not result:
        raise HTTPException(
            status_code=401,
            detail="Ugyldigt eller udløbet login link. Anmod om et nyt."
        )
    
    # Set session cookie (httpOnly for security)
    response.set_cookie(
        key="session_token",
        value=result["session_token"],
        httponly=True,
        secure=True,  # HTTPS only
        samesite="lax",
        max_age=7 * 24 * 60 * 60  # 7 days
    )
    
    return SessionResponse(**result)


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get current authenticated user's profile
    
    ✅ BATCH 1.2: Auto-generates agent_email if missing
    
    Requires valid session token in Authorization header or cookie
    """
    from sqlalchemy import select
    from app.models.user import User
    from app.services.agent_mail_service import AgentMailService
    
    # Get full user object from database
    result = await db.execute(
        select(User).where(User.id == current_user["user_id"])
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # ✅ BATCH 1.2: Generate agent_email if missing
    if not user.agent_email:
        agent_mail_service = AgentMailService()
        user.agent_email = await agent_mail_service.generate_unique_email(
            user_name=user.name or user.email.split('@')[0],
            db=db
        )
        await db.commit()
        await db.refresh(user)
        logger.info(f"✅ Generated agent_email for user {user.id}: {user.agent_email}")
    
    return UserResponse(
        user_id=user.id,
        email=user.email,
        name=user.name,
        agent_email=user.agent_email,
        onboarding_complete=user.onboarding_complete
    )


@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    """
    Logout user by revoking session
    
    Clears session cookie and revokes session in database
    """
    # Get session token
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.replace("Bearer ", "")
    
    if session_token:
        await auth_service.logout(session_token, db)
    
    # Clear cookie
    response.delete_cookie("session_token")
    
    return {"success": True, "message": "Logged out successfully"}


@router.get("/check")
async def check_session(
    current_user: dict = Depends(get_current_user)
):
    """
    Check if session is valid (for frontend to verify auth status)
    """
    return {
        "authenticated": True,
        "user_id": current_user["user_id"],
        "onboarding_complete": current_user["onboarding_complete"]
    }


@router.get("/debug/magic-link/{email}")
async def get_magic_link_for_testing(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """
    DEBUG ONLY: Get a valid magic link for testing
    This should be removed in production!
    """
    from sqlalchemy import select, desc
    from app.models.user import User, MagicLink
    
    # Get user
    result = await db.execute(
        select(User).where(User.email == email)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create new magic link
    from app.services.auth_service import auth_service
    token, hashed_token = auth_service.generate_magic_token()
    
    from datetime import datetime, timedelta
    magic_link = MagicLink(
        user_id=user.id,
        token_hash=hashed_token,
        expires_at=datetime.utcnow() + timedelta(minutes=15),
        used=False
    )
    db.add(magic_link)
    await db.commit()
    
    return {
        "email": email,
        "magic_link": f"http://localhost:3000/auth/verify?token={token}&email={email}",
        "token": token
    }
