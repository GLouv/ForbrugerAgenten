"""Unified Quote model"""
from sqlalchemy import Column, String, DateTime, Numeric, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Quote(Base):
    """
    Unified Quote model - an offer from a provider
    """
    __tablename__ = "quotes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    quote_request_id = Column(String, ForeignKey("quote_requests.id"), nullable=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Core categorization
    category = Column(String, nullable=False, index=True)  # energy, mobile, internet
    provider = Column(String, nullable=False, index=True)
    product_name = Column(String, nullable=True)
    
    # Financials
    monthly_price = Column(Numeric(10, 2), nullable=False)
    creation_fee = Column(Numeric(10, 2), default=0)
    annual_price = Column(Numeric(10, 2), nullable=True)
    
    # Savings calculation
    estimated_annual_savings = Column(Numeric(10, 2), nullable=True)
    
    # Category specific details (JSONB)
    details = Column(JSONB, nullable=True)
    
    # Commission / Business logic
    commission_amount = Column(Numeric(10, 2), nullable=True)
    
    # Badges & Recommendations
    is_cheapest = Column(Boolean, default=False)
    is_best_value = Column(Boolean, default=False)
    is_recommended = Column(Boolean, default=False)
    recommendation_reason = Column(String, nullable=True)
    
    # Status
    status = Column(String, default="received", index=True)  # received, accepted, rejected, expired
    valid_until = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    quote_request = relationship("QuoteRequest", back_populates="quotes")
    user = relationship("User", back_populates="quotes")
    
    def __repr__(self):
        return f"<Quote {self.category}: {self.provider} - {self.monthly_price}>"





