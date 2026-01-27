"""Admin Authentication Service - JWT based auth for admin panel"""
import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.admin_user import AdminUser, AdminRole
from app.core.config import settings


class AdminAuthService:
    """Service for admin authentication"""
    
    SECRET_KEY = settings.SECRET_KEY
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS = 8
    
    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(
            plain_password.encode('utf-8'), 
            hashed_password.encode('utf-8')
        )
    
    def create_access_token(self, admin_id: str, role: str) -> str:
        """Create JWT access token"""
        expire = datetime.utcnow() + timedelta(hours=self.ACCESS_TOKEN_EXPIRE_HOURS)
        payload = {
            "sub": admin_id,
            "role": role,
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "admin_access"
        }
        return jwt.encode(payload, self.SECRET_KEY, algorithm=self.ALGORITHM)
    
    def decode_token(self, token: str) -> Optional[dict]:
        """Decode and verify JWT token"""
        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM])
            if payload.get("type") != "admin_access":
                return None
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    async def authenticate(
        self, 
        db: AsyncSession, 
        email: str, 
        password: str
    ) -> Optional[AdminUser]:
        """Authenticate admin user"""
        result = await db.execute(
            select(AdminUser).where(AdminUser.email == email)
        )
        admin = result.scalar_one_or_none()
        
        if not admin:
            return None
        
        if not admin.is_active:
            return None
        
        # Check if password_hash exists (for backwards compatibility)
        if not hasattr(admin, 'password_hash') or not admin.password_hash:
            return None
        
        if not self.verify_password(password, admin.password_hash):
            return None
        
        # Update last login
        admin.last_login_at = datetime.utcnow()
        await db.commit()
        
        return admin
    
    async def get_admin_by_id(self, db: AsyncSession, admin_id: str) -> Optional[AdminUser]:
        """Get admin user by ID"""
        result = await db.execute(
            select(AdminUser).where(AdminUser.id == admin_id)
        )
        return result.scalar_one_or_none()
    
    async def create_admin(
        self,
        db: AsyncSession,
        email: str,
        password: str,
        full_name: str,
        role: AdminRole = AdminRole.MODERATOR
    ) -> AdminUser:
        """Create new admin user"""
        admin = AdminUser(
            email=email,
            password_hash=self.hash_password(password),
            full_name=full_name,
            role=role,
            is_active=True
        )
        db.add(admin)
        await db.commit()
        await db.refresh(admin)
        return admin


# Singleton instance
admin_auth_service = AdminAuthService()





