"""Admin Authentication Endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr
from typing import Optional

from app.core.database import get_db
from app.services.admin_auth_service import admin_auth_service
from app.models.admin_user import AdminUser, AdminRole

router = APIRouter()


# === SCHEMAS ===

class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: dict

class AdminMeResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool
    permissions: Optional[dict] = None

class AdminCreateRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "moderator"


# === DEPENDENCY ===

async def get_current_admin(
    authorization: str = Header(...),
    db: AsyncSession = Depends(get_db)
) -> AdminUser:
    """Dependency to get current authenticated admin"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header"
        )
    
    token = authorization.replace("Bearer ", "")
    payload = admin_auth_service.decode_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    admin = await admin_auth_service.get_admin_by_id(db, payload["sub"])
    
    if not admin or not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin not found or inactive"
        )
    
    return admin


async def require_super_admin(
    admin: AdminUser = Depends(get_current_admin)
) -> AdminUser:
    """Dependency requiring super_admin role"""
    if admin.role != AdminRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required"
        )
    return admin


# === ENDPOINTS ===

@router.post("/login", response_model=AdminLoginResponse)
async def admin_login(
    request: AdminLoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """Admin login endpoint"""
    admin = await admin_auth_service.authenticate(db, request.email, request.password)
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    token = admin_auth_service.create_access_token(admin.id, admin.role.value)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "admin": {
            "id": admin.id,
            "email": admin.email,
            "full_name": admin.full_name,
            "role": admin.role.value
        }
    }


@router.get("/me", response_model=AdminMeResponse)
async def get_current_admin_info(
    admin: AdminUser = Depends(get_current_admin)
):
    """Get current admin info"""
    return {
        "id": admin.id,
        "email": admin.email,
        "full_name": admin.full_name,
        "role": admin.role.value,
        "is_active": admin.is_active,
        "permissions": admin.permissions
    }


@router.post("/create", response_model=AdminMeResponse)
async def create_admin(
    request: AdminCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_super_admin)
):
    """Create new admin (super_admin only)"""
    # Check if email already exists
    from sqlalchemy import select
    existing = await db.execute(
        select(AdminUser).where(AdminUser.email == request.email)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    role = AdminRole(request.role) if request.role in [r.value for r in AdminRole] else AdminRole.MODERATOR
    
    admin = await admin_auth_service.create_admin(
        db=db,
        email=request.email,
        password=request.password,
        full_name=request.full_name,
        role=role
    )
    
    return {
        "id": admin.id,
        "email": admin.email,
        "full_name": admin.full_name,
        "role": admin.role.value,
        "is_active": admin.is_active,
        "permissions": admin.permissions
    }


@router.post("/setup-first-admin", response_model=AdminLoginResponse)
async def setup_first_admin(
    request: AdminCreateRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    One-time setup endpoint to create the first super admin.
    Only works if no admins exist.
    """
    from sqlalchemy import select, func
    
    # Check if any admin exists
    count_result = await db.execute(select(func.count(AdminUser.id)))
    admin_count = count_result.scalar()
    
    if admin_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin users already exist. Use /admin/create with super_admin credentials."
        )
    
    # Create first super admin
    admin = await admin_auth_service.create_admin(
        db=db,
        email=request.email,
        password=request.password,
        full_name=request.full_name,
        role=AdminRole.SUPER_ADMIN
    )
    
    token = admin_auth_service.create_access_token(admin.id, admin.role.value)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "admin": {
            "id": admin.id,
            "email": admin.email,
            "full_name": admin.full_name,
            "role": admin.role.value
        }
    }





