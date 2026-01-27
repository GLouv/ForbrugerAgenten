"""Support endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.services.support_service import SupportService
from app.models.support import SupportTicket

router = APIRouter()
support_service = SupportService()

# Schemas
class TicketCreate(BaseModel):
    subject: str
    description: str
    category: str
    contract_id: Optional[str] = None

class TicketMessage(BaseModel):
    message: str

class TicketResponse(BaseModel):
    id: str
    subject: str
    description: Optional[str] = None
    category: str
    status: str
    messages: Optional[List[dict]] = []
    created_at: Optional[str] = None
    
    class Config:
        from_attributes = True
    
    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=obj.id,
            subject=obj.subject,
            description=obj.description,
            category=obj.category,
            status=obj.status,
            messages=obj.messages or [],
            created_at=str(obj.created_at) if obj.created_at else None
        )

@router.post("/tickets")
async def create_ticket(
    ticket_data: TicketCreate,
    user_id: str, # TODO: Auth
    db: AsyncSession = Depends(get_db)
):
    """Create a new support ticket"""
    ticket = await support_service.create_ticket(db, user_id, ticket_data.model_dump())
    return TicketResponse.from_orm(ticket)

@router.get("/tickets")
async def get_tickets(
    user_id: str, # TODO: Auth
    db: AsyncSession = Depends(get_db)
):
    """Get all user tickets"""
    result = await db.execute(select(SupportTicket).where(SupportTicket.user_id == user_id))
    tickets = result.scalars().all()
    return [TicketResponse.from_orm(t) for t in tickets]

@router.post("/tickets/{ticket_id}/message")
async def add_message(
    ticket_id: str,
    message_data: TicketMessage,
    db: AsyncSession = Depends(get_db)
):
    """Add message to ticket"""
    ticket = await support_service.add_message(db, ticket_id, message_data.message)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket





