"""Support Ticket model"""
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.core.database import Base


class TicketType(str, enum.Enum):
    """✅ BATCH 1.1: Ticket categorization for AI sorting"""
    COMPLAINT = "complaint"           # User complaint about provider
    SWITCH_REQUEST = "switch_request" # User wants to switch provider
    QUESTION = "question"             # General question
    SYSTEM_NOTICE = "system_notice"   # Automated system notification


class SupportTicket(Base):
    """
    Support Ticket - A customer service request handled by ForbrugerAgenten
    on behalf of the user towards a provider.
    """
    __tablename__ = "support_tickets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Context
    contract_id = Column(String, ForeignKey("contracts.id"), nullable=True)
    provider_id = Column(String, ForeignKey("providers.id"), nullable=True)
    category = Column(String, nullable=False)  # energy, mobile, internet
    
    # ✅ BATCH 1.1: New field for ticket classification
    type = Column(Enum(TicketType), default=TicketType.QUESTION, nullable=False, index=True)
    
    # Content
    subject = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    
    # Status tracking
    status = Column(String, default="open", index=True) 
    # open: Created by user
    # processing: Agent working on it
    # waiting_for_provider: Contacted provider, waiting for reply
    # waiting_for_user: Need info from user
    # resolved: Done
    
    priority = Column(String, default="normal") # low, normal, high, urgent
    
    # Conversation history (Simplified for MVP - could be separate table later)
    # List of { sender: 'user'|'agent'|'provider', message: '...', timestamp: '...' }
    messages = Column(JSON, default=list)
    
    # Internal notes
    internal_notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="support_tickets")
    contract = relationship("Contract")
    provider = relationship("Provider")
    
    def __repr__(self):
        return f"<SupportTicket {self.id} - {self.type.value} - {self.status}>"
