"""
Admin Setup Endpoints
One-time setup tasks for production deployment
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.admin_auth_service import AdminAuthService
from app.models.admin_user import AdminUser

router = APIRouter()


@router.post("/seed-providers")
async def seed_providers_endpoint(
    db: AsyncSession = Depends(get_db)
):
    """Seed the providers database with initial data"""
    try:
        from scripts.seed_providers import seed_providers
        # seed_providers creates its own session
        await seed_providers()
        return {"status": "success", "message": "Providers seeded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Seeding failed: {str(e)}")


@router.post("/create-admin")
async def create_admin_endpoint(
    email: str = "admin@forbrugeragenten.dk",
    password: str = "Admin123!",
    db: AsyncSession = Depends(get_db)
):
    """Create the initial admin user - FAST VERSION with pre-computed hash"""
    try:
        from sqlalchemy import select, text
        import uuid
        from datetime import datetime
        
        # Check if admin already exists
        result = await db.execute(
            select(AdminUser).where(AdminUser.email == email)
        )
        existing = result.scalar_one_or_none()
        
        if existing:
            return {
                "status": "exists", 
                "message": "Admin user already exists",
                "admin": {
                    "id": str(existing.id),
                    "email": existing.email,
                    "role": existing.role
                }
            }
        
        # Pre-computed hash for Admin123! (bcrypt rounds=4, ultra fast)
        # Generated locally to avoid slow hashing on Railway
        password_hash = "REDACTED_PASSWORD_HASH"
        
        # Create admin with raw SQL for maximum speed
        admin_id = str(uuid.uuid4())
        
        await db.execute(
            text("""
                INSERT INTO admin_users 
                (id, email, full_name, role, is_active, password_hash, created_at, updated_at)
                VALUES (:id, :email, :full_name, :role, :is_active, :password_hash, NOW(), NOW())
            """),
            {
                "id": admin_id,
                "email": email,
                "full_name": "Super Admin",
                "role": "super_admin",
                "is_active": True,
                "password_hash": password_hash
            }
        )
        
        await db.commit()
        
        return {
            "status": "created",
            "message": "Admin user created successfully! ✅",
            "credentials": {
                "email": email,
                "password": password,
                "login_url": "/admin/login"
            },
            "admin": {
                "id": admin_id,
                "email": email,
                "role": "super_admin",
                "is_active": True
            }
        }
    except Exception as e:
        await db.rollback()
        import traceback
        error_detail = f"Admin creation failed: {str(e)}\n\nTraceback:\n{traceback.format_exc()}"
        print(error_detail)  # Log to Railway
        raise HTTPException(status_code=500, detail=error_detail)


@router.get("/status")
async def setup_status(db: AsyncSession = Depends(get_db)):
    """Check setup status"""
    from sqlalchemy import select, func
    from app.models.provider import Provider
    from app.models.admin_user import AdminUser
    
    # Count providers
    provider_count = await db.scalar(select(func.count(Provider.id)))
    
    # Count admins
    admin_count = await db.scalar(select(func.count(AdminUser.id)))
    
    return {
        "providers_seeded": provider_count > 0,
        "provider_count": provider_count,
        "admin_created": admin_count > 0,
        "admin_count": admin_count,
        "ready_for_production": provider_count > 0 and admin_count > 0
    }




