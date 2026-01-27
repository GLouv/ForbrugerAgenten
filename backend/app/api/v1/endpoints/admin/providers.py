"""Admin Providers Endpoints - Provider management and scorecards"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, or_
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr

from app.core.database import get_db
from app.models.provider import Provider
from app.models.quote_request import QuoteRequest
from app.api.v1.endpoints.admin.auth import get_current_admin

router = APIRouter()


# === SCHEMAS ===

class ProviderListItem(BaseModel):
    id: str
    name: str
    categories: List[str]
    quote_email: Optional[str] = None
    is_active: bool
    reputation_score: int
    avg_response_time_hours: float
    is_slow_responder: bool
    total_leads_sent: int
    total_deals_won: int
    created_at: datetime

class ProviderDetail(BaseModel):
    id: str
    name: str
    quote_email: Optional[str] = None
    support_email: Optional[str] = None
    categories: List[str]
    is_active: bool
    reputation_score: int
    avg_response_time_hours: float
    is_slow_responder: bool
    total_leads_sent: int
    total_deals_won: int
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    conversion_rate: float

class ProviderCreate(BaseModel):
    name: str
    quote_email: Optional[str] = None
    support_email: Optional[str] = None
    categories: List[str]
    is_active: bool = True
    admin_notes: Optional[str] = None

class ProviderUpdate(BaseModel):
    name: Optional[str] = None
    quote_email: Optional[str] = None
    support_email: Optional[str] = None
    categories: Optional[List[str]] = None
    is_active: Optional[bool] = None
    admin_notes: Optional[str] = None
    reputation_score: Optional[int] = None

class ProviderScorecard(BaseModel):
    id: str
    name: str
    reputation_score: int
    avg_response_time_hours: float
    is_slow_responder: bool
    total_leads_sent: int
    total_deals_won: int
    conversion_rate: float
    rank: int


# === ENDPOINTS ===

@router.get("/", response_model=List[ProviderListItem])
async def list_providers(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin),
    category: Optional[str] = None,
    status: Optional[str] = None,  # "active", "inactive", "slow"
    search: Optional[str] = None,
    sort_by: str = "reputation_score"  # "reputation_score", "response_time", "leads"
):
    """List all providers with filtering"""
    query = select(Provider)
    
    # Category filter
    if category:
        query = query.where(Provider.categories.contains([category]))
    
    # Status filter
    if status == "active":
        query = query.where(Provider.is_active == True)
    elif status == "inactive":
        query = query.where(Provider.is_active == False)
    elif status == "slow":
        query = query.where(Provider.is_slow_responder == True)
    
    # Search
    if search:
        query = query.where(
            or_(
                Provider.name.ilike(f"%{search}%"),
                Provider.quote_email.ilike(f"%{search}%")
            )
        )
    
    # Sorting
    if sort_by == "reputation_score":
        query = query.order_by(desc(Provider.reputation_score))
    elif sort_by == "response_time":
        query = query.order_by(Provider.avg_response_time_hours)
    elif sort_by == "leads":
        query = query.order_by(desc(Provider.total_leads_sent))
    else:
        query = query.order_by(Provider.name)
    
    result = await db.execute(query)
    providers = result.scalars().all()
    
    return [
        ProviderListItem(
            id=p.id,
            name=p.name,
            categories=p.categories if isinstance(p.categories, list) else [],
            quote_email=p.quote_email,
            is_active=p.is_active,
            reputation_score=p.reputation_score,
            avg_response_time_hours=p.avg_response_time_hours,
            is_slow_responder=p.is_slow_responder,
            total_leads_sent=p.total_leads_sent,
            total_deals_won=p.total_deals_won,
            created_at=p.created_at
        )
        for p in providers
    ]


@router.get("/scorecards", response_model=List[ProviderScorecard])
async def get_provider_scorecards(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin),
    category: Optional[str] = None
):
    """Get provider performance scorecards ranked by reputation"""
    query = select(Provider).where(Provider.is_active == True)
    
    if category:
        query = query.where(Provider.categories.contains([category]))
    
    query = query.order_by(desc(Provider.reputation_score))
    
    result = await db.execute(query)
    providers = result.scalars().all()
    
    scorecards = []
    for rank, p in enumerate(providers, 1):
        conversion_rate = (p.total_deals_won / p.total_leads_sent * 100) if p.total_leads_sent > 0 else 0
        scorecards.append(ProviderScorecard(
            id=p.id,
            name=p.name,
            reputation_score=p.reputation_score,
            avg_response_time_hours=p.avg_response_time_hours,
            is_slow_responder=p.is_slow_responder,
            total_leads_sent=p.total_leads_sent,
            total_deals_won=p.total_deals_won,
            conversion_rate=round(conversion_rate, 1),
            rank=rank
        ))
    
    return scorecards


@router.get("/{provider_id}", response_model=ProviderDetail)
async def get_provider(
    provider_id: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Get provider details"""
    result = await db.execute(select(Provider).where(Provider.id == provider_id))
    provider = result.scalar_one_or_none()
    
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    conversion_rate = (provider.total_deals_won / provider.total_leads_sent * 100) if provider.total_leads_sent > 0 else 0
    
    return ProviderDetail(
        id=provider.id,
        name=provider.name,
        quote_email=provider.quote_email,
        support_email=provider.support_email,
        categories=provider.categories if isinstance(provider.categories, list) else [],
        is_active=provider.is_active,
        reputation_score=provider.reputation_score,
        avg_response_time_hours=provider.avg_response_time_hours,
        is_slow_responder=provider.is_slow_responder,
        total_leads_sent=provider.total_leads_sent,
        total_deals_won=provider.total_deals_won,
        admin_notes=provider.admin_notes,
        created_at=provider.created_at,
        updated_at=provider.updated_at,
        conversion_rate=round(conversion_rate, 1)
    )


@router.post("/", response_model=ProviderDetail)
async def create_provider(
    data: ProviderCreate,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Create new provider"""
    # Check if name exists
    existing = await db.execute(
        select(Provider).where(Provider.name == data.name)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Provider name already exists")
    
    provider = Provider(
        name=data.name,
        quote_email=data.quote_email,
        support_email=data.support_email,
        categories=data.categories,
        is_active=data.is_active,
        admin_notes=data.admin_notes
    )
    
    db.add(provider)
    await db.commit()
    await db.refresh(provider)
    
    return ProviderDetail(
        id=provider.id,
        name=provider.name,
        quote_email=provider.quote_email,
        support_email=provider.support_email,
        categories=provider.categories,
        is_active=provider.is_active,
        reputation_score=provider.reputation_score,
        avg_response_time_hours=provider.avg_response_time_hours,
        is_slow_responder=provider.is_slow_responder,
        total_leads_sent=provider.total_leads_sent,
        total_deals_won=provider.total_deals_won,
        admin_notes=provider.admin_notes,
        created_at=provider.created_at,
        updated_at=provider.updated_at,
        conversion_rate=0.0
    )


@router.put("/{provider_id}", response_model=ProviderDetail)
async def update_provider(
    provider_id: str,
    data: ProviderUpdate,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Update provider"""
    result = await db.execute(select(Provider).where(Provider.id == provider_id))
    provider = result.scalar_one_or_none()
    
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    # Update fields
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(provider, field, value)
    
    provider.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(provider)
    
    conversion_rate = (provider.total_deals_won / provider.total_leads_sent * 100) if provider.total_leads_sent > 0 else 0
    
    return ProviderDetail(
        id=provider.id,
        name=provider.name,
        quote_email=provider.quote_email,
        support_email=provider.support_email,
        categories=provider.categories if isinstance(provider.categories, list) else [],
        is_active=provider.is_active,
        reputation_score=provider.reputation_score,
        avg_response_time_hours=provider.avg_response_time_hours,
        is_slow_responder=provider.is_slow_responder,
        total_leads_sent=provider.total_leads_sent,
        total_deals_won=provider.total_deals_won,
        admin_notes=provider.admin_notes,
        created_at=provider.created_at,
        updated_at=provider.updated_at,
        conversion_rate=round(conversion_rate, 1)
    )


@router.post("/{provider_id}/pause")
async def pause_provider(
    provider_id: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Pause provider (stop sending leads)"""
    result = await db.execute(select(Provider).where(Provider.id == provider_id))
    provider = result.scalar_one_or_none()
    
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    provider.is_active = False
    provider.updated_at = datetime.utcnow()
    await db.commit()
    
    return {"status": "success", "message": f"Provider {provider.name} paused"}


@router.post("/{provider_id}/activate")
async def activate_provider(
    provider_id: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Activate provider"""
    result = await db.execute(select(Provider).where(Provider.id == provider_id))
    provider = result.scalar_one_or_none()
    
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    provider.is_active = True
    provider.updated_at = datetime.utcnow()
    await db.commit()
    
    return {"status": "success", "message": f"Provider {provider.name} activated"}


@router.post("/{provider_id}/flag-slow")
async def flag_slow_responder(
    provider_id: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Flag provider as slow responder"""
    result = await db.execute(select(Provider).where(Provider.id == provider_id))
    provider = result.scalar_one_or_none()
    
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    provider.is_slow_responder = True
    provider.reputation_score = max(0, provider.reputation_score - 10)  # Decrease reputation
    provider.updated_at = datetime.utcnow()
    await db.commit()
    
    return {"status": "success", "message": f"Provider {provider.name} flagged as slow responder"}


@router.delete("/{provider_id}")
async def delete_provider(
    provider_id: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Delete provider"""
    result = await db.execute(select(Provider).where(Provider.id == provider_id))
    provider = result.scalar_one_or_none()
    
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    await db.delete(provider)
    await db.commit()
    
    return {"status": "success", "message": f"Provider {provider.name} deleted"}





