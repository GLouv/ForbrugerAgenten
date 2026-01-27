"""Admin Users Endpoints - User CRM management"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, or_
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr

from app.core.database import get_db
from app.models.user import User
from app.models.contract import Contract
from app.models.quote_request import QuoteRequest
from app.models.support import SupportTicket
from app.models.email_log import EmailLog
from app.api.v1.endpoints.admin.auth import get_current_admin, require_super_admin

router = APIRouter()


# === SCHEMAS ===

class UserListItem(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    agent_email: Optional[str] = None
    onboarding_completed: bool
    contracts_count: int
    created_at: datetime

class UserDetail(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    postal_code: Optional[str] = None
    city: Optional[str] = None
    agent_email: Optional[str] = None
    forward_marketing_emails: bool
    forward_essential_emails: bool
    onboarding_completed: bool
    consent_given: bool
    consent_date: Optional[datetime] = None
    mitid_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    postal_code: Optional[str] = None
    city: Optional[str] = None

class ContractSummary(BaseModel):
    id: str
    category: str
    provider: Optional[str] = None
    monthly_price: Optional[float] = None
    status: str
    created_at: datetime

class ActivitySummary(BaseModel):
    id: str
    type: str
    title: str
    timestamp: datetime

class UserExport(BaseModel):
    user: dict
    contracts: List[dict]
    quote_requests: List[dict]
    support_tickets: List[dict]
    emails: List[dict]

class PaginatedUsers(BaseModel):
    items: List[UserListItem]
    total: int
    page: int
    limit: int
    pages: int


# === ENDPOINTS ===

@router.get("/", response_model=PaginatedUsers)
async def list_users(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = None  # "active", "incomplete"
):
    """List all users with search and filtering"""
    offset = (page - 1) * limit
    
    # Base query
    query = select(User)
    count_query = select(func.count(User.id))
    
    # Search filter
    if search:
        search_filter = or_(
            User.email.ilike(f"%{search}%"),
            User.full_name.ilike(f"%{search}%"),
            User.name.ilike(f"%{search}%"),
            User.phone.ilike(f"%{search}%"),
            User.agent_email.ilike(f"%{search}%")
        )
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)
    
    # Status filter
    if status == "active":
        query = query.where(User.onboarding_completed == True)
        count_query = count_query.where(User.onboarding_completed == True)
    elif status == "incomplete":
        query = query.where(User.onboarding_completed == False)
        count_query = count_query.where(User.onboarding_completed == False)
    
    # Get total count
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    # Get paginated results
    query = query.order_by(desc(User.created_at)).offset(offset).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()
    
    # Get contract counts for each user
    items = []
    for user in users:
        contracts_count_result = await db.execute(
            select(func.count(Contract.id)).where(Contract.user_id == user.id)
        )
        contracts_count = contracts_count_result.scalar() or 0
        
        items.append(UserListItem(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            phone=user.phone,
            agent_email=user.agent_email,
            onboarding_completed=user.onboarding_completed,
            contracts_count=contracts_count,
            created_at=user.created_at
        ))
    
    return PaginatedUsers(
        items=items,
        total=total,
        page=page,
        limit=limit,
        pages=(total + limit - 1) // limit
    )


@router.get("/{user_id}", response_model=UserDetail)
async def get_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Get user details"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserDetail(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        name=user.name,
        phone=user.phone,
        address=user.address,
        postal_code=user.postal_code,
        city=user.city,
        agent_email=user.agent_email,
        forward_marketing_emails=user.forward_marketing_emails,
        forward_essential_emails=user.forward_essential_emails,
        onboarding_completed=user.onboarding_completed,
        consent_given=user.consent_given,
        consent_date=user.consent_date,
        mitid_verified=user.mitid_verified,
        created_at=user.created_at,
        updated_at=user.updated_at,
        last_login=user.last_login
    )


@router.put("/{user_id}", response_model=UserDetail)
async def update_user(
    user_id: str,
    data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Update user details"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update fields
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    
    user.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(user)
    
    return UserDetail(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        name=user.name,
        phone=user.phone,
        address=user.address,
        postal_code=user.postal_code,
        city=user.city,
        agent_email=user.agent_email,
        forward_marketing_emails=user.forward_marketing_emails,
        forward_essential_emails=user.forward_essential_emails,
        onboarding_completed=user.onboarding_completed,
        consent_given=user.consent_given,
        consent_date=user.consent_date,
        mitid_verified=user.mitid_verified,
        created_at=user.created_at,
        updated_at=user.updated_at,
        last_login=user.last_login
    )


@router.get("/{user_id}/contracts", response_model=List[ContractSummary])
async def get_user_contracts(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Get user's contracts"""
    result = await db.execute(
        select(Contract)
        .where(Contract.user_id == user_id)
        .order_by(desc(Contract.created_at))
    )
    contracts = result.scalars().all()
    
    return [
        ContractSummary(
            id=c.id,
            category=c.category,
            provider=c.provider,
            monthly_price=c.monthly_price,
            status=c.status,
            created_at=c.created_at
        )
        for c in contracts
    ]


@router.get("/{user_id}/activity", response_model=List[ActivitySummary])
async def get_user_activity(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin),
    limit: int = 50
):
    """Get user's activity timeline"""
    activities = []
    
    # Emails
    emails_result = await db.execute(
        select(EmailLog)
        .where(EmailLog.user_id == user_id)
        .order_by(desc(EmailLog.created_at))
        .limit(20)
    )
    for email in emails_result.scalars():
        activities.append(ActivitySummary(
            id=f"email-{email.id}",
            type="email",
            title=f"Email: {email.subject}",
            timestamp=email.created_at
        ))
    
    # Support tickets
    tickets_result = await db.execute(
        select(SupportTicket)
        .where(SupportTicket.user_id == user_id)
        .order_by(desc(SupportTicket.created_at))
        .limit(20)
    )
    for ticket in tickets_result.scalars():
        activities.append(ActivitySummary(
            id=f"ticket-{ticket.id}",
            type="ticket",
            title=f"Ticket: {ticket.subject}",
            timestamp=ticket.created_at
        ))
    
    # Quote requests
    requests_result = await db.execute(
        select(QuoteRequest)
        .where(QuoteRequest.user_id == user_id)
        .order_by(desc(QuoteRequest.created_at))
        .limit(20)
    )
    for request in requests_result.scalars():
        activities.append(ActivitySummary(
            id=f"request-{request.id}",
            type="quote_request",
            title="Tilbudsforespørgsel oprettet",
            timestamp=request.created_at
        ))
    
    # Sort and limit
    activities.sort(key=lambda x: x.timestamp, reverse=True)
    return activities[:limit]


@router.get("/{user_id}/export", response_model=UserExport)
async def export_user_data(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Export all user data (GDPR)"""
    # Get user
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get contracts
    contracts_result = await db.execute(
        select(Contract).where(Contract.user_id == user_id)
    )
    contracts = [
        {
            "id": c.id,
            "category": c.category,
            "provider": c.provider,
            "monthly_price": c.monthly_price,
            "status": c.status,
            "created_at": c.created_at.isoformat() if c.created_at else None
        }
        for c in contracts_result.scalars()
    ]
    
    # Get quote requests
    requests_result = await db.execute(
        select(QuoteRequest).where(QuoteRequest.user_id == user_id)
    )
    quote_requests = [
        {
            "id": r.id,
            "categories": r.categories,
            "status": r.status,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in requests_result.scalars()
    ]
    
    # Get support tickets
    tickets_result = await db.execute(
        select(SupportTicket).where(SupportTicket.user_id == user_id)
    )
    tickets = [
        {
            "id": t.id,
            "subject": t.subject,
            "status": t.status,
            "created_at": t.created_at.isoformat() if t.created_at else None
        }
        for t in tickets_result.scalars()
    ]
    
    # Get emails
    emails_result = await db.execute(
        select(EmailLog).where(EmailLog.user_id == user_id)
    )
    emails = [
        {
            "id": e.id,
            "type": e.email_type,
            "subject": e.subject,
            "sent": e.sent,
            "created_at": e.created_at.isoformat() if e.created_at else None
        }
        for e in emails_result.scalars()
    ]
    
    return UserExport(
        user={
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "phone": user.phone,
            "address": user.address,
            "postal_code": user.postal_code,
            "city": user.city,
            "agent_email": user.agent_email,
            "created_at": user.created_at.isoformat() if user.created_at else None
        },
        contracts=contracts,
        quote_requests=quote_requests,
        support_tickets=tickets,
        emails=emails
    )


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(require_super_admin)  # Only super admin can delete
):
    """Delete user and all related data (GDPR)"""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete user (cascades will handle related data)
    await db.delete(user)
    await db.commit()
    
    return {"status": "success", "message": f"User {user_id} and all related data deleted"}





