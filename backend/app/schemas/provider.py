from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class ProviderBase(BaseModel):
    name: str
    website: Optional[str] = None
    logo_url: Optional[str] = None
    quote_email: Optional[str] = None
    categories: List[str]  # ["energy", "mobile"]
    is_active: bool = True

class ProviderCreate(ProviderBase):
    pass

class ProviderResponse(ProviderBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True





