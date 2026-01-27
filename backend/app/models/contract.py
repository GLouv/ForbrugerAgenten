"""Unified Contract model"""
from sqlalchemy import Column, String, DateTime, Numeric, ForeignKey, Date, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Contract(Base):
    """
    Unified Contract model for all categories (Energy, Mobile, Internet)
    """
    __tablename__ = "contracts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Core categorization
    category = Column(String, nullable=False, index=True)  # energy, mobile, internet
    provider = Column(String, nullable=False, index=True)
    name = Column(String, nullable=True)  # e.g., "Fri Data + 50GB"
    
    # Financials
    monthly_price = Column(Numeric(10, 2), nullable=True)
    currency = Column(String, default="DKK")
    
    # Category specific details (JSONB for flexibility)
    # Energy: { "type": "spot", "kwh_price": 0.5 }
    # Mobile: { "data_gb": 50, "hours": -1 } (-1 = unlimited)
    # Internet: { "speed_down": 1000, "speed_up": 100, "tech": "fiber" }
    details = Column(JSONB, nullable=True)
    
    # Contract terms
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    binding_period_months = Column(Integer, nullable=True)
    
    # Status
    status = Column(String, default="active", index=True)  # active, pending_switch, cancelled
    
    # ✅ BATCH 1.1: New fields for Bill Parser
    contract_file_url = Column(String, nullable=True)  # URL to uploaded contract/bill PDF
    last_parsed_at = Column(DateTime, nullable=True)   # When was this contract last analyzed by AI
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="contracts")
    
    def __repr__(self):
        return f"<Contract {self.category}: {self.provider}>"





