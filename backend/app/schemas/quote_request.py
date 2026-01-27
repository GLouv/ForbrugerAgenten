from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

class QuoteRequestBase(BaseModel):
    categories: List[str]
    user_data: Optional[Dict[str, Any]] = None

class QuoteRequestCreate(QuoteRequestBase):
    pass

class QuoteRequestUpdate(BaseModel):
    status: Optional[str] = None
    responses_count: Optional[Dict[str, Any]] = None

class QuoteRequestResponse(QuoteRequestBase):
    id: str
    user_id: str
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True





