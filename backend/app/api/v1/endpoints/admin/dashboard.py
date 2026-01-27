"""Admin Dashboard Endpoints - Queue management and overview"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.models.support import SupportTicket
from app.models.quote_request import QuoteRequest
from app.models.quote import Quote
from app.models.user import User
from app.models.provider import Provider
from app.api.v1.endpoints.admin.auth import get_current_admin

router = APIRouter()


# === SCHEMAS ===

class QueueItem(BaseModel):
    id: str
    type: str  # "ticket", "quote_request", "awaiting_user"
    title: str
    description: Optional[str] = None
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    provider_name: Optional[str] = None
    category: Optional[str] = None
    status: str
    priority: Optional[str] = None
    days_waiting: int
    created_at: datetime
    updated_at: Optional[datetime] = None

class DashboardStats(BaseModel):
    total_users: int
    users_today: int
    active_quote_requests: int
    open_tickets: int
    pending_provider_response: int
    awaiting_user_action: int

class ActivityItem(BaseModel):
    id: str
    type: str  # "signup", "quote_request", "ticket", "quote_received"
    title: str
    description: str
    timestamp: datetime
    user_id: Optional[str] = None
    user_name: Optional[str] = None


# === ENDPOINTS ===

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Get dashboard overview statistics"""
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    # Total users
    total_users = await db.execute(select(func.count(User.id)))
    total_users_count = total_users.scalar() or 0
    
    # Users today
    users_today = await db.execute(
        select(func.count(User.id)).where(User.created_at >= today)
    )
    users_today_count = users_today.scalar() or 0
    
    # Active quote requests
    active_requests = await db.execute(
        select(func.count(QuoteRequest.id)).where(
            QuoteRequest.status.in_(["pending", "in_progress"])
        )
    )
    active_requests_count = active_requests.scalar() or 0
    
    # Open tickets
    open_tickets = await db.execute(
        select(func.count(SupportTicket.id)).where(
            SupportTicket.status.in_(["open", "processing", "waiting_for_provider"])
        )
    )
    open_tickets_count = open_tickets.scalar() or 0
    
    # Pending provider response (>3 days)
    three_days_ago = datetime.utcnow() - timedelta(days=3)
    pending_provider = await db.execute(
        select(func.count(QuoteRequest.id)).where(
            QuoteRequest.status == "pending",
            QuoteRequest.created_at <= three_days_ago
        )
    )
    pending_provider_count = pending_provider.scalar() or 0
    
    # Awaiting user action (quotes received but not accepted)
    # This would need a proper query based on your quote model
    awaiting_user_count = 0
    
    return {
        "total_users": total_users_count,
        "users_today": users_today_count,
        "active_quote_requests": active_requests_count,
        "open_tickets": open_tickets_count,
        "pending_provider_response": pending_provider_count,
        "awaiting_user_action": awaiting_user_count
    }


@router.get("/queues/all", response_model=List[QueueItem])
async def get_all_queues(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin),
    limit: int = 50
):
    """Get all items in queues (tickets + quote requests)"""
    items = []
    now = datetime.utcnow()
    
    # Get support tickets
    tickets_result = await db.execute(
        select(SupportTicket, User)
        .join(User, SupportTicket.user_id == User.id)
        .where(SupportTicket.status.in_(["open", "processing", "waiting_for_provider"]))
        .order_by(desc(SupportTicket.created_at))
        .limit(limit // 2)
    )
    
    for ticket, user in tickets_result:
        days = (now - ticket.created_at).days
        items.append(QueueItem(
            id=ticket.id,
            type="ticket",
            title=ticket.subject,
            description=ticket.description[:100] if ticket.description else None,
            user_name=user.full_name or user.name,
            user_email=user.email,
            category=ticket.category,
            status=ticket.status,
            priority=ticket.priority,
            days_waiting=days,
            created_at=ticket.created_at,
            updated_at=ticket.updated_at
        ))
    
    # Get quote requests
    requests_result = await db.execute(
        select(QuoteRequest, User)
        .join(User, QuoteRequest.user_id == User.id)
        .where(QuoteRequest.status.in_(["pending", "in_progress"]))
        .order_by(desc(QuoteRequest.created_at))
        .limit(limit // 2)
    )
    
    for request, user in requests_result:
        days = (now - request.created_at).days
        categories = request.categories if isinstance(request.categories, list) else []
        items.append(QueueItem(
            id=request.id,
            type="quote_request",
            title=f"Tilbudsforespørgsel: {', '.join(categories)}",
            description=None,
            user_name=user.full_name or user.name,
            user_email=user.email,
            category=categories[0] if categories else None,
            status=request.status,
            priority="normal",
            days_waiting=days,
            created_at=request.created_at,
            updated_at=request.updated_at
        ))
    
    # Sort by days waiting (oldest first)
    items.sort(key=lambda x: x.days_waiting, reverse=True)
    
    return items[:limit]


@router.get("/queues/pending-provider", response_model=List[QueueItem])
async def get_pending_provider_queue(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin),
    min_days: int = 3
):
    """Get items waiting for provider response > min_days"""
    cutoff = datetime.utcnow() - timedelta(days=min_days)
    items = []
    now = datetime.utcnow()
    
    # Tickets waiting for provider
    tickets_result = await db.execute(
        select(SupportTicket, User)
        .join(User, SupportTicket.user_id == User.id)
        .where(
            SupportTicket.status == "waiting_for_provider",
            SupportTicket.updated_at <= cutoff
        )
        .order_by(SupportTicket.updated_at)
    )
    
    for ticket, user in tickets_result:
        days = (now - ticket.updated_at).days if ticket.updated_at else (now - ticket.created_at).days
        items.append(QueueItem(
            id=ticket.id,
            type="ticket",
            title=ticket.subject,
            user_name=user.full_name or user.name,
            user_email=user.email,
            status=ticket.status,
            days_waiting=days,
            created_at=ticket.created_at,
            updated_at=ticket.updated_at
        ))
    
    # Quote requests pending > min_days
    requests_result = await db.execute(
        select(QuoteRequest, User)
        .join(User, QuoteRequest.user_id == User.id)
        .where(
            QuoteRequest.status == "pending",
            QuoteRequest.created_at <= cutoff
        )
        .order_by(QuoteRequest.created_at)
    )
    
    for request, user in requests_result:
        days = (now - request.created_at).days
        items.append(QueueItem(
            id=request.id,
            type="quote_request",
            title=f"Tilbudsforespørgsel",
            user_name=user.full_name or user.name,
            user_email=user.email,
            status=request.status,
            days_waiting=days,
            created_at=request.created_at
        ))
    
    return items


@router.get("/activity", response_model=List[ActivityItem])
async def get_recent_activity(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin),
    limit: int = 50
):
    """Get recent system activity"""
    items = []
    
    # Recent signups
    users_result = await db.execute(
        select(User)
        .order_by(desc(User.created_at))
        .limit(20)
    )
    
    for user in users_result.scalars():
        items.append(ActivityItem(
            id=f"signup-{user.id}",
            type="signup",
            title="Ny bruger",
            description=f"{user.full_name or user.name or user.email} oprettede sig",
            timestamp=user.created_at,
            user_id=user.id,
            user_name=user.full_name or user.name
        ))
    
    # Recent quote requests
    requests_result = await db.execute(
        select(QuoteRequest, User)
        .join(User, QuoteRequest.user_id == User.id)
        .order_by(desc(QuoteRequest.created_at))
        .limit(20)
    )
    
    for request, user in requests_result:
        items.append(ActivityItem(
            id=f"request-{request.id}",
            type="quote_request",
            title="Ny tilbudsforespørgsel",
            description=f"{user.full_name or user.name} anmodede om tilbud",
            timestamp=request.created_at,
            user_id=user.id,
            user_name=user.full_name or user.name
        ))
    
    # Recent tickets
    tickets_result = await db.execute(
        select(SupportTicket, User)
        .join(User, SupportTicket.user_id == User.id)
        .order_by(desc(SupportTicket.created_at))
        .limit(20)
    )
    
    for ticket, user in tickets_result:
        items.append(ActivityItem(
            id=f"ticket-{ticket.id}",
            type="ticket",
            title="Ny support sag",
            description=f"{ticket.subject}",
            timestamp=ticket.created_at,
            user_id=user.id,
            user_name=user.full_name or user.name
        ))
    
    # Sort by timestamp
    items.sort(key=lambda x: x.timestamp, reverse=True)
    
    return items[:limit]


@router.post("/queues/{item_type}/{item_id}/send-reminder")
async def send_reminder(
    item_type: str,
    item_id: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Send reminder to provider for a queue item"""
    # Log the action - in production would send actual email
    return {"status": "success", "message": f"Reminder queued for {item_type} {item_id}"}


@router.post("/queues/{item_type}/{item_id}/resolve")
async def resolve_item(
    item_type: str,
    item_id: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Mark a queue item as resolved"""
    if item_type == "ticket":
        result = await db.execute(
            select(SupportTicket).where(SupportTicket.id == item_id)
        )
        ticket = result.scalar_one_or_none()
        if ticket:
            ticket.status = "resolved"
            ticket.closed_at = datetime.utcnow()
            await db.commit()
            return {"status": "success", "message": "Ticket resolved"}
    
    elif item_type == "quote_request":
        result = await db.execute(
            select(QuoteRequest).where(QuoteRequest.id == item_id)
        )
        request = result.scalar_one_or_none()
        if request:
            request.status = "completed"
            await db.commit()
            return {"status": "success", "message": "Quote request completed"}
    
    raise HTTPException(status_code=404, detail="Item not found")





