"""
Message Model - For Inbox/Messages between users and providers
"""
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Boolean, ForeignKey, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base


class MessageType(str, enum.Enum):
    """Types of messages"""
    QUOTE = "quote"           # Tilbud fra selskab
    INFO = "info"             # Information fra selskab
    MARKETING = "marketing"   # Reklamer/tilbud
    SYSTEM = "system"         # System beskeder
    SUPPORT = "support"       # Support beskeder
    REMINDER = "reminder"     # Påmindelser


class MessageStatus(str, enum.Enum):
    """Message status"""
    UNREAD = "unread"
    READ = "read"
    ARCHIVED = "archived"
    DELETED = "deleted"


class MessageDirection(str, enum.Enum):
    """Message direction"""
    INBOUND = "inbound"   # From provider to user
    OUTBOUND = "outbound" # From user/system to provider


class Message(Base):
    """Message model for inbox"""
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, nullable=False, index=True)
    
    # Provider info (if from/to provider)
    provider_id = Column(String, ForeignKey("providers.id"), nullable=True)
    provider_name = Column(String, nullable=True)  # Denormalized for display
    
    # Message content
    subject = Column(String(500), nullable=False)
    body = Column(Text, nullable=False)
    body_html = Column(Text, nullable=True)  # HTML version if available
    
    # Metadata
    message_type = Column(String(50), default="info")
    direction = Column(String(50), default="inbound")
    status = Column(String(50), default="unread")
    
    # Related entities
    quote_request_id = Column(UUID(as_uuid=True), nullable=True)  # Link to quote request
    case_id = Column(String, nullable=True)  # External case reference
    
    # Email metadata (if from parsed email)
    original_email_id = Column(String, nullable=True)
    from_email = Column(String, nullable=True)
    to_email = Column(String, nullable=True)
    
    # Attachments (stored as JSON array)
    attachments = Column(JSON, default=list)
    
    # Parsed data (for quotes)
    parsed_data = Column(JSON, nullable=True)  # Structured data extracted from message
    
    # Timestamps
    sent_at = Column(DateTime, nullable=True)  # When originally sent
    received_at = Column(DateTime, default=datetime.utcnow)
    read_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    provider = relationship("Provider", back_populates="messages")
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": self.user_id,
            "provider_id": str(self.provider_id) if self.provider_id else None,
            "provider_name": self.provider_name,
            "subject": self.subject,
            "body": self.body,
            "body_html": self.body_html,
            "message_type": self.message_type,
            "direction": self.direction,
            "status": self.status,
            "quote_request_id": str(self.quote_request_id) if self.quote_request_id else None,
            "case_id": self.case_id,
            "attachments": self.attachments or [],
            "parsed_data": self.parsed_data,
            "sent_at": self.sent_at.isoformat() if self.sent_at else None,
            "received_at": self.received_at.isoformat() if self.received_at else None,
            "read_at": self.read_at.isoformat() if self.read_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class NotificationPreferences(Base):
    """User notification preferences"""
    __tablename__ = "notification_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, unique=True, nullable=False, index=True)
    
    # Email preferences
    email_quotes = Column(Boolean, default=True)        # Tilbud fra selskaber
    email_marketing = Column(Boolean, default=False)    # Reklamer fra selskaber
    email_system = Column(Boolean, default=True)        # System beskeder
    email_reminders = Column(Boolean, default=True)     # Påmindelser
    email_newsletter = Column(Boolean, default=False)   # Nyhedsbrev fra os
    
    # In-app preferences
    inbox_quotes = Column(Boolean, default=True)        # Vis tilbud i inbox
    inbox_marketing = Column(Boolean, default=False)    # Vis reklamer i inbox
    inbox_system = Column(Boolean, default=True)        # Vis system beskeder
    
    # Push notifications (for mobile app)
    push_quotes = Column(Boolean, default=True)
    push_marketing = Column(Boolean, default=False)
    push_reminders = Column(Boolean, default=True)
    push_price_alerts = Column(Boolean, default=True)   # Pris ændringer
    
    # Provider specific permissions
    allow_provider_contact = Column(Boolean, default=True)  # Selskaber må kontakte
    share_data_with_providers = Column(Boolean, default=False)  # Del data med selskaber
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": self.user_id,
            "email": {
                "quotes": self.email_quotes,
                "marketing": self.email_marketing,
                "system": self.email_system,
                "reminders": self.email_reminders,
                "newsletter": self.email_newsletter,
            },
            "inbox": {
                "quotes": self.inbox_quotes,
                "marketing": self.inbox_marketing,
                "system": self.inbox_system,
            },
            "push": {
                "quotes": self.push_quotes,
                "marketing": self.push_marketing,
                "reminders": self.push_reminders,
                "price_alerts": self.push_price_alerts,
            },
            "provider": {
                "allow_contact": self.allow_provider_contact,
                "share_data": self.share_data_with_providers,
            },
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }



