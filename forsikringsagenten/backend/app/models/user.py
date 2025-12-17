"""
User Authentication Models
For Magic Link email authentication
"""
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid

from app.core.database import Base


class User(Base):
    """User model for authentication"""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=True)
    
    # User status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Onboarding
    onboarding_complete = Column(Boolean, default=False)
    onboarding_step = Column(String, nullable=True)  # Current step if incomplete
    
    # User's agent email for receiving provider emails
    agent_email = Column(String, unique=True, nullable=True)  # e.g., user123@inbound.forbrugeragent.dk
    
    # Personal info (collected during onboarding)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    city = Column(String, nullable=True)
    
    # Services interested in
    wants_energy = Column(Boolean, default=False)
    wants_mobile = Column(Boolean, default=False)
    wants_internet = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)
    
    # Relationships
    magic_links = relationship("MagicLink", back_populates="user")
    sessions = relationship("Session", back_populates="user")
    
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "is_active": self.is_active,
            "is_verified": self.is_verified,
            "onboarding_complete": self.onboarding_complete,
            "onboarding_step": self.onboarding_step,
            "agent_email": self.agent_email,
            "phone": self.phone,
            "address": self.address,
            "postal_code": self.postal_code,
            "city": self.city,
            "wants_energy": self.wants_energy,
            "wants_mobile": self.wants_mobile,
            "wants_internet": self.wants_internet,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "last_login_at": self.last_login_at.isoformat() if self.last_login_at else None,
        }


class MagicLink(Base):
    """Magic link tokens for email authentication"""
    __tablename__ = "magic_links"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Hashed token (never store raw tokens!)
    token_hash = Column(String, nullable=False, index=True)
    
    # Token status
    used = Column(Boolean, default=False)
    used_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="magic_links")


class Session(Base):
    """User session after successful login"""
    __tablename__ = "sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Session token
    token = Column(String, unique=True, nullable=False, index=True)
    
    # Session status
    revoked = Column(Boolean, default=False)
    revoked_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=False, index=True)
    
    # Activity tracking
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_activity_at = Column(DateTime, default=datetime.utcnow)
    
    # User agent / IP (for security)
    user_agent = Column(Text, nullable=True)
    ip_address = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="sessions")
