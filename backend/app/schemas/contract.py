from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional, Dict, Any
from decimal import Decimal

class ContractBase(BaseModel):
    category: str  # energy, mobile, internet
    provider: str
    name: Optional[str] = None
    monthly_price: Optional[Decimal] = None
    currency: str = "DKK"
    details: Optional[Dict[str, Any]] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    binding_period_months: Optional[int] = None
    status: str = "active"

class ContractCreate(ContractBase):
    pass

class ContractUpdate(BaseModel):
    provider: Optional[str] = None
    name: Optional[str] = None
    monthly_price: Optional[Decimal] = None
    details: Optional[Dict[str, Any]] = None
    status: Optional[str] = None

class ContractResponse(ContractBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True





