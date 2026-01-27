"""
Inbox/Messages API Endpoints
Handles user inbox, messages, and notification preferences
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func, and_, or_
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
import uuid

from app.core.database import get_db
from app.models.message import Message, NotificationPreferences

router = APIRouter()


# ============== Pydantic Schemas ==============

class MessageCreate(BaseModel):
    provider_id: Optional[str] = None
    provider_name: Optional[str] = None
    subject: str
    body: str
    body_html: Optional[str] = None
    message_type: str = "info"
    direction: str = "inbound"
    quote_request_id: Optional[str] = None
    case_id: Optional[str] = None
    attachments: Optional[List[dict]] = []
    parsed_data: Optional[dict] = None


class NotificationPreferencesUpdate(BaseModel):
    email_quotes: Optional[bool] = None
    email_marketing: Optional[bool] = None
    email_system: Optional[bool] = None
    email_reminders: Optional[bool] = None
    email_newsletter: Optional[bool] = None
    inbox_quotes: Optional[bool] = None
    inbox_marketing: Optional[bool] = None
    inbox_system: Optional[bool] = None
    push_quotes: Optional[bool] = None
    push_marketing: Optional[bool] = None
    push_reminders: Optional[bool] = None
    push_price_alerts: Optional[bool] = None
    allow_provider_contact: Optional[bool] = None
    share_data_with_providers: Optional[bool] = None


# ============== Inbox Endpoints ==============

@router.get("")
async def get_inbox(
    user_id: str,
    status: Optional[str] = None,
    message_type: Optional[str] = None,
    provider_id: Optional[str] = None,
    limit: int = Query(default=50, le=100),
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """Get user's inbox messages"""
    
    # Build query
    query = select(Message).where(Message.user_id == user_id)
    
    # Apply filters
    if status:
        query = query.where(Message.status == status)
    else:
        # By default, exclude deleted
        query = query.where(Message.status != "deleted")
    
    if message_type:
        query = query.where(Message.message_type == message_type)
    
    if provider_id:
        query = query.where(Message.provider_id == provider_id)
    
    # Get notification preferences to filter out unwanted messages
    prefs_result = await db.execute(
        select(NotificationPreferences).where(NotificationPreferences.user_id == user_id)
    )
    prefs = prefs_result.scalar_one_or_none()
    
    if prefs:
        # Filter based on preferences
        filters = []
        if not prefs.inbox_marketing:
            filters.append(Message.message_type != "marketing")
        if not prefs.inbox_quotes:
            filters.append(Message.message_type != "quote")
        
        if filters:
            query = query.where(and_(*filters))
    
    # Order by newest first
    query = query.order_by(Message.received_at.desc())
    
    # Get total count
    count_query = select(func.count(Message.id)).where(Message.user_id == user_id)
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    # Get unread count
    unread_query = select(func.count(Message.id)).where(
        and_(
            Message.user_id == user_id,
            Message.status == "unread"
        )
    )
    unread_result = await db.execute(unread_query)
    unread = unread_result.scalar() or 0
    
    # Apply pagination
    query = query.offset(offset).limit(limit)
    
    # Execute
    result = await db.execute(query)
    messages = result.scalars().all()
    
    return {
        "messages": [m.to_dict() for m in messages],
        "total": total,
        "unread": unread,
        "limit": limit,
        "offset": offset
    }


@router.get("/stats")
async def get_inbox_stats(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get inbox statistics"""
    
    # Total messages
    total_result = await db.execute(
        select(func.count(Message.id)).where(
            and_(
                Message.user_id == user_id,
                Message.status != "deleted"
            )
        )
    )
    total = total_result.scalar() or 0
    
    # Unread messages
    unread_result = await db.execute(
        select(func.count(Message.id)).where(
            and_(
                Message.user_id == user_id,
                Message.status == "unread"
            )
        )
    )
    unread = unread_result.scalar() or 0
    
    # By type
    type_stats = {}
    for msg_type in ["quote", "info", "marketing", "system", "support", "reminder"]:
        type_result = await db.execute(
            select(func.count(Message.id)).where(
                and_(
                    Message.user_id == user_id,
                    Message.message_type == msg_type,
                    Message.status != "deleted"
                )
            )
        )
        type_stats[msg_type] = type_result.scalar() or 0
    
    # Pending quotes (tilbud der afventer svar)
    pending_quotes = await db.execute(
        select(func.count(Message.id)).where(
            and_(
                Message.user_id == user_id,
                Message.message_type == "quote",
                Message.status == "unread"
            )
        )
    )
    
    return {
        "total": total,
        "unread": unread,
        "by_type": type_stats,
        "pending_quotes": pending_quotes.scalar() or 0
    }


@router.get("/{message_id}")
async def get_message(
    message_id: str,
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific message"""
    result = await db.execute(
        select(Message).where(
            and_(
                Message.id == message_id,
                Message.user_id == user_id
            )
        )
    )
    message = result.scalar_one_or_none()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return message.to_dict()


@router.post("/{message_id}/read")
async def mark_as_read(
    message_id: str,
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Mark a message as read"""
    result = await db.execute(
        select(Message).where(
            and_(
                Message.id == message_id,
                Message.user_id == user_id
            )
        )
    )
    message = result.scalar_one_or_none()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.status = "read"
    message.read_at = datetime.utcnow()
    await db.commit()
    
    return {"status": "success", "message": "Message marked as read"}


@router.post("/read-all")
async def mark_all_as_read(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Mark all messages as read"""
    await db.execute(
        update(Message)
        .where(
            and_(
                Message.user_id == user_id,
                Message.status == "unread"
            )
        )
        .values(status="read", read_at=datetime.utcnow())
    )
    await db.commit()
    
    return {"status": "success", "message": "All messages marked as read"}


@router.post("/{message_id}/archive")
async def archive_message(
    message_id: str,
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Archive a message"""
    result = await db.execute(
        select(Message).where(
            and_(
                Message.id == message_id,
                Message.user_id == user_id
            )
        )
    )
    message = result.scalar_one_or_none()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.status = "archived"
    await db.commit()
    
    return {"status": "success", "message": "Message archived"}


@router.delete("/{message_id}")
async def delete_message(
    message_id: str,
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Delete a message (soft delete)"""
    result = await db.execute(
        select(Message).where(
            and_(
                Message.id == message_id,
                Message.user_id == user_id
            )
        )
    )
    message = result.scalar_one_or_none()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.status = "deleted"
    await db.commit()
    
    return {"status": "success", "message": "Message deleted"}


@router.post("")
async def create_message(
    user_id: str,
    message_data: MessageCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new message (for system/testing)"""
    message = Message(
        user_id=user_id,
        provider_id=message_data.provider_id,
        provider_name=message_data.provider_name,
        subject=message_data.subject,
        body=message_data.body,
        body_html=message_data.body_html,
        message_type=message_data.message_type,
        direction=message_data.direction,
        quote_request_id=message_data.quote_request_id,
        case_id=message_data.case_id,
        attachments=message_data.attachments,
        parsed_data=message_data.parsed_data,
        received_at=datetime.utcnow()
    )
    
    db.add(message)
    await db.commit()
    await db.refresh(message)
    
    return message.to_dict()


# ============== Notification Preferences Endpoints ==============

@router.get("/preferences")
async def get_notification_preferences(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get user's notification preferences"""
    result = await db.execute(
        select(NotificationPreferences).where(NotificationPreferences.user_id == user_id)
    )
    prefs = result.scalar_one_or_none()
    
    if not prefs:
        # Create default preferences
        prefs = NotificationPreferences(user_id=user_id)
        db.add(prefs)
        await db.commit()
        await db.refresh(prefs)
    
    return prefs.to_dict()


@router.put("/preferences")
async def update_notification_preferences(
    user_id: str,
    updates: NotificationPreferencesUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update user's notification preferences"""
    result = await db.execute(
        select(NotificationPreferences).where(NotificationPreferences.user_id == user_id)
    )
    prefs = result.scalar_one_or_none()
    
    if not prefs:
        prefs = NotificationPreferences(user_id=user_id)
        db.add(prefs)
    
    # Update only provided fields
    update_data = updates.dict(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            setattr(prefs, field, value)
    
    await db.commit()
    await db.refresh(prefs)
    
    return {
        "status": "success",
        "message": "Preferences updated",
        "preferences": prefs.to_dict()
    }


# ============== Provider Messages Timeline ==============

@router.get("/provider/{provider_id}/timeline")
async def get_provider_timeline(
    provider_id: str,
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get message timeline with a specific provider"""
    result = await db.execute(
        select(Message)
        .where(
            and_(
                Message.user_id == user_id,
                Message.provider_id == provider_id,
                Message.status != "deleted"
            )
        )
        .order_by(Message.received_at.asc())
    )
    messages = result.scalars().all()
    
    return {
        "provider_id": provider_id,
        "timeline": [m.to_dict() for m in messages],
        "message_count": len(messages)
    }



