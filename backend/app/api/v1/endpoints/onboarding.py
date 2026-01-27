"""
Onboarding API Endpoints
For collecting user information and completing setup
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import logging
import uuid

from app.core.database import get_db
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


# ============== Pydantic Schemas ==============

class ProfileData(BaseModel):
    """User profile information"""
    full_name: str
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    postal_code: Optional[str] = None
    city: Optional[str] = None


class InsurersData(BaseModel):
    """User's current insurance companies"""
    current_insurers: List[str]


class ConsentData(BaseModel):
    """User consent and fuldmagt"""
    consent_given: bool
    fuldmagt_accepted: bool


class OnboardingComplete(BaseModel):
    """Mark onboarding as complete"""
    onboarding_completed: bool


class OnboardingStatusResponse(BaseModel):
    """Current onboarding status"""
    onboarding_completed: bool
    onboarding_step: Optional[str]
    profile: Optional[dict]
    current_insurers: Optional[List[str]]
    consent_given: Optional[bool]
    fuldmagt_accepted: Optional[bool]
    agent_email: Optional[str]


class ServicesData(BaseModel):
    """Services user wants (Energy/Mobile/Internet)"""
    wants_energy: bool = False
    wants_mobile: bool = False
    wants_internet: bool = False


# ============== Onboarding Endpoints ==============

@router.get("/status", response_model=OnboardingStatusResponse)
async def get_onboarding_status(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get current onboarding status and data
    """
    result = await db.execute(
        select(User).where(User.id == current_user["user_id"])
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Parse current_insurers if stored as string (for now just return empty list)
    current_insurers = []  # TODO: Store in separate table if needed
    
    return OnboardingStatusResponse(
        onboarding_completed=user.onboarding_complete,
        onboarding_step=user.onboarding_step,
        profile={
            "full_name": user.name,
            "phone": user.phone,
            "date_of_birth": None,  # TODO: Add to model
            "address": user.address,
            "postal_code": user.postal_code,
            "city": user.city,
        } if user.name else None,
        current_insurers=current_insurers,
        consent_given=None,  # TODO: Store in separate consent table if needed
        fuldmagt_accepted=None,
        agent_email=user.agent_email
    )


@router.post("/profile")
async def save_profile(
    profile: ProfileData,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Save user profile information (Step 1)
    """
    result = await db.execute(
        select(User).where(User.id == current_user["user_id"])
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update user profile
    user.name = profile.full_name
    user.phone = profile.phone
    user.address = profile.address
    user.postal_code = profile.postal_code
    user.city = profile.city
    # TODO: Add date_of_birth to User model if needed
    user.onboarding_step = "services"  # Next step
    
    await db.commit()
    await db.refresh(user)
    
    logger.info(f"✅ Profile saved for user: {user.id}")
    
    return {"success": True, "message": "Profile saved"}


@router.post("/services")
async def save_services(
    services: ServicesData,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Save which services user wants (Energy/Mobile/Internet) (Step 2)
    """
    result = await db.execute(
        select(User).where(User.id == current_user["user_id"])
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update services
    user.wants_energy = services.wants_energy
    user.wants_mobile = services.wants_mobile
    user.wants_internet = services.wants_internet
    user.onboarding_step = "consent"
    
    # Generate agent email if not exists
    if not user.agent_email:
        # Create unique email: user-{short_id}@inbound.forbrugeragent.dk
        short_id = str(uuid.uuid4())[:8]
        user.agent_email = f"user-{short_id}@inbound.forbrugeragent.dk"
        logger.info(f"✅ Generated agent email: {user.agent_email}")
    
    await db.commit()
    await db.refresh(user)
    
    logger.info(f"✅ Services saved for user: {user.id}")
    
    return {
        "success": True,
        "message": "Services saved",
        "agent_email": user.agent_email
    }


@router.post("/insurers")
async def save_insurers(
    insurers: InsurersData,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Save user's current insurance companies (Optional/Legacy)
    Note: This is for insurance flow, might not be needed for energy
    """
    result = await db.execute(
        select(User).where(User.id == current_user["user_id"])
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # For now, just log it - we can store in a separate table later
    logger.info(f"📝 Insurers for user {user.id}: {insurers.current_insurers}")
    
    user.onboarding_step = "consent"
    await db.commit()
    
    return {"success": True, "message": "Insurers saved"}


@router.post("/consent")
async def save_consent(
    consent: ConsentData,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Save user consent and fuldmagt acceptance (Step 3)
    Note: Actual signing happens via separate signing endpoint
    """
    result = await db.execute(
        select(User).where(User.id == current_user["user_id"])
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # TODO: Store consent in separate table with timestamps
    logger.info(f"✅ Consent saved for user: {user.id}")
    
    user.onboarding_step = "complete"
    
    await db.commit()
    
    return {"success": True, "message": "Consent saved"}


@router.post("/complete")
async def complete_onboarding(
    data: OnboardingComplete,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Mark onboarding as complete (Final step)
    """
    result = await db.execute(
        select(User).where(User.id == current_user["user_id"])
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.onboarding_complete = data.onboarding_completed
    user.onboarding_step = "completed"
    
    await db.commit()
    await db.refresh(user)
    
    logger.info(f"🎉 Onboarding complete for user: {user.id}")
    
    return {
        "success": True,
        "message": "Onboarding complete! Welcome to ForbrugerAgenten!",
        "user": user.to_dict()
    }
