"""Provider model"""
from sqlalchemy import Column, String, Boolean, JSON, Integer, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Provider(Base):
    """
    Provider model - Represents a Service Provider (e.g., Norlys, Telenor)
    Includes 'Scorecard' metrics for the Admin Dashboard.
    """
    __tablename__ = "providers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True, index=True)
    
    # Contact Info
    quote_email = Column(String, nullable=True) # Where we send requests
    support_email = Column(String, nullable=True) # Where we send complaints
    
    # Configuration
    categories = Column(JSON, nullable=False) # ["energy", "mobile"]
    is_active = Column(Boolean, default=True)
    
    # PERFORMANCE SCORECARD (The "Stick")
    # Updated by background jobs based on actual response times
    reputation_score = Column(Integer, default=50) # 0-100 (Starts neutral)
    avg_response_time_hours = Column(Float, default=0.0) # E.g. 24.5 hours
    is_slow_responder = Column(Boolean, default=False) # "Bad Service" flag
    
    # LEAD TRACKING (The "Carrot")
    total_leads_sent = Column(Integer, default=0) # How many potential customers we sent
    total_deals_won = Column(Integer, default=0) # How many converted
    
    # Internal Notes for Admins
    admin_notes = Column(String, nullable=True) # E.g. "Hard to work with, but cheap prices"
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    messages = relationship("Message", back_populates="provider")

    def __repr__(self):
        return f"<Provider {self.name} (Score: {self.reputation_score})>"




