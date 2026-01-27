from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WaitlistBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None

class WaitlistCreate(WaitlistBase):
    pass

class WaitlistResponse(WaitlistBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

