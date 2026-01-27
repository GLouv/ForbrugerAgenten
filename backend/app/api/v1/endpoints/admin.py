"""
Admin Dashboard API Endpoints
For monitoring users, emails, AI agents, and system health
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, desc
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.core.database import get_db
from app.models.message import Message, NotificationPreferences
from app.models.provider import Provider
from app.models.waitlist import WaitlistEntry

router = APIRouter()


# ============== Pydantic Schemas ==============

class AdminStats(BaseModel):
    """Overall system statistics"""
    total_users: int
    total_messages: int
    total_providers: int
    messages_today: int
    messages_pending_review: int
    active_conversations: int


class EmailFlowStats(BaseModel):
    """Email system statistics"""
    sent_today: int
    received_today: int
    failed_today: int
    by_type: Dict[str, int]
    by_provider: List[Dict[str, Any]]
    ai_analyzed: int
    ai_auto_responded: int


# ============== Admin Endpoints ==============

@router.get("/stats")
async def get_admin_stats(db: AsyncSession = Depends(get_db)) -> AdminStats:
    """Get overall system statistics"""
    
    # Count users (using waitlist for now)
    users_result = await db.execute(select(func.count(WaitlistEntry.id)))
    total_users = users_result.scalar() or 0
    
    # Count messages
    messages_result = await db.execute(select(func.count(Message.id)))
    total_messages = messages_result.scalar() or 0
    
    # Count providers
    providers_result = await db.execute(select(func.count(Provider.id)))
    total_providers = providers_result.scalar() or 0
    
    # Messages today
    today = datetime.utcnow().date()
    today_result = await db.execute(
        select(func.count(Message.id)).where(
            func.date(Message.created_at) == today
        )
    )
    messages_today = today_result.scalar() or 0
    
    # Messages pending review (unread, requires_human flag)
    pending_result = await db.execute(
        select(func.count(Message.id)).where(
            Message.status == "unread"
        )
    )
    messages_pending = pending_result.scalar() or 0
    
    # Active conversations (unique user/provider pairs with recent messages)
    active_result = await db.execute(
        select(func.count(func.distinct(Message.user_id))).where(
            Message.created_at >= datetime.utcnow() - timedelta(days=7)
        )
    )
    active_conversations = active_result.scalar() or 0
    
    return AdminStats(
        total_users=total_users,
        total_messages=total_messages,
        total_providers=total_providers,
        messages_today=messages_today,
        messages_pending_review=messages_pending,
        active_conversations=active_conversations
    )


@router.get("/emails/flows")
async def get_email_flows(
    days: int = Query(default=7, le=90),
    db: AsyncSession = Depends(get_db)
) -> EmailFlowStats:
    """
    Get email flow statistics
    
    Shows:
    - How many emails sent/received
    - Breakdown by type
    - Provider response rates
    - AI performance
    """
    
    since = datetime.utcnow() - timedelta(days=days)
    today = datetime.utcnow().date()
    
    # Sent today (outbound)
    sent_result = await db.execute(
        select(func.count(Message.id)).where(
            and_(
                Message.direction == "outbound",
                func.date(Message.created_at) == today
            )
        )
    )
    sent_today = sent_result.scalar() or 0
    
    # Received today (inbound)
    received_result = await db.execute(
        select(func.count(Message.id)).where(
            and_(
                Message.direction == "inbound",
                func.date(Message.created_at) == today
            )
        )
    )
    received_today = received_result.scalar() or 0
    
    # Failed (we'd track this separately, set to 0 for now)
    failed_today = 0
    
    # By type
    type_result = await db.execute(
        select(
            Message.message_type,
            func.count(Message.id).label("count")
        ).where(
            Message.created_at >= since
        ).group_by(Message.message_type)
    )
    by_type = {row[0]: row[1] for row in type_result}
    
    # By provider (top 10)
    provider_result = await db.execute(
        select(
            Provider.name,
            func.count(Message.id).label("message_count"),
            func.avg(Provider.avg_response_time_hours).label("avg_response_time")
        ).join(
            Message, Message.provider_id == Provider.id
        ).where(
            Message.created_at >= since
        ).group_by(Provider.id, Provider.name).order_by(desc("message_count")).limit(10)
    )
    by_provider = [
        {
            "name": row[0],
            "messages": row[1],
            "avg_response_hours": round(row[2], 1) if row[2] else 0
        }
        for row in provider_result
    ]
    
    # AI stats (would need separate tracking, mock for now)
    ai_analyzed = int(received_today * 0.8)  # Assume 80% analyzed
    ai_auto_responded = int(received_today * 0.2)  # Assume 20% auto-responded
    
    return EmailFlowStats(
        sent_today=sent_today,
        received_today=received_today,
        failed_today=failed_today,
        by_type=by_type,
        by_provider=by_provider,
        ai_analyzed=ai_analyzed,
        ai_auto_responded=ai_auto_responded
    )


@router.get("/messages/recent")
async def get_recent_messages(
    limit: int = Query(default=50, le=200),
    status: Optional[str] = None,
    message_type: Optional[str] = None,
    provider_id: Optional[str] = None,
    requires_review: bool = False,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get recent messages for admin review
    
    Useful for:
    - Monitoring all email traffic
    - Finding messages that need human review
    - Debugging email flows
    """
    
    query = select(Message).order_by(Message.created_at.desc())
    
    # Apply filters
    if status:
        query = query.where(Message.status == status)
    
    if message_type:
        query = query.where(Message.message_type == message_type)
    
    if provider_id:
        query = query.where(Message.provider_id == provider_id)
    
    if requires_review:
        # Show unread messages (potential review needed)
        query = query.where(Message.status == "unread")
    
    # Limit
    query = query.limit(limit)
    
    # Execute
    result = await db.execute(query)
    messages = result.scalars().all()
    
    return {
        "messages": [m.to_dict() for m in messages],
        "count": len(messages)
    }


@router.get("/providers/performance")
async def get_provider_performance(
    db: AsyncSession = Depends(get_db)
) -> List[Dict[str, Any]]:
    """
    Get provider performance scorecard
    
    Shows:
    - Response times
    - Lead conversion rates
    - Reputation scores
    """
    
    result = await db.execute(
        select(Provider).order_by(desc(Provider.reputation_score))
    )
    providers = result.scalars().all()
    
    return [
        {
            "id": p.id,
            "name": p.name,
            "categories": p.categories,
            "reputation_score": p.reputation_score,
            "avg_response_time_hours": p.avg_response_time_hours,
            "is_slow_responder": p.is_slow_responder,
            "total_leads_sent": p.total_leads_sent,
            "total_deals_won": p.total_deals_won,
            "conversion_rate": round(p.total_deals_won / p.total_leads_sent * 100, 1) if p.total_leads_sent > 0 else 0,
            "is_active": p.is_active,
            "admin_notes": p.admin_notes,
        }
        for p in providers
    ]


@router.get("/ai/activity")
async def get_ai_activity(
    hours: int = Query(default=24, le=168),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get AI agent activity log
    
    Shows:
    - How many emails AI has analyzed
    - Auto-responses sent
    - Errors/failures
    - Confidence scores
    """
    
    since = datetime.utcnow() - timedelta(hours=hours)
    
    # Get messages with AI analysis (we'd track this in parsed_data)
    result = await db.execute(
        select(Message).where(
            and_(
                Message.created_at >= since,
                Message.parsed_data.isnot(None)
            )
        ).order_by(Message.created_at.desc()).limit(100)
    )
    messages = result.scalars().all()
    
    # Analyze AI performance
    ai_analyzed = len(messages)
    high_confidence = sum(1 for m in messages if m.parsed_data and m.parsed_data.get("confidence", 0) > 0.8)
    low_confidence = sum(1 for m in messages if m.parsed_data and m.parsed_data.get("confidence", 0) < 0.5)
    requires_human = sum(1 for m in messages if m.parsed_data and m.parsed_data.get("requires_human", False))
    
    return {
        "period_hours": hours,
        "total_analyzed": ai_analyzed,
        "high_confidence": high_confidence,
        "low_confidence": low_confidence,
        "requires_human_review": requires_human,
        "recent_analyses": [
            {
                "message_id": str(m.id),
                "from": m.from_email,
                "subject": m.subject,
                "analysis": m.parsed_data,
                "timestamp": m.created_at.isoformat()
            }
            for m in messages[:20]  # Last 20
        ]
    }


@router.get("/users/{user_id}/detail")
async def get_user_detail(
    user_id: str,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get detailed view of specific user
    
    Shows:
    - All messages
    - Notification preferences
    - Active quotes
    - Conversation history
    """
    
    # Get user's messages
    messages_result = await db.execute(
        select(Message).where(
            Message.user_id == user_id
        ).order_by(Message.created_at.desc())
    )
    messages = messages_result.scalars().all()
    
    # Get preferences
    prefs_result = await db.execute(
        select(NotificationPreferences).where(
            NotificationPreferences.user_id == user_id
        )
    )
    preferences = prefs_result.scalar_one_or_none()
    
    # Stats
    total_messages = len(messages)
    unread_messages = sum(1 for m in messages if m.status == "unread")
    active_providers = len(set(m.provider_id for m in messages if m.provider_id))
    
    return {
        "user_id": user_id,
        "stats": {
            "total_messages": total_messages,
            "unread_messages": unread_messages,
            "active_providers": active_providers,
        },
        "messages": [m.to_dict() for m in messages],
        "preferences": preferences.to_dict() if preferences else None,
    }
