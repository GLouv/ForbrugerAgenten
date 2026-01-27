"""Admin Analytics Endpoints - KPIs and reporting"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, and_
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.models.user import User
from app.models.contract import Contract
from app.models.quote_request import QuoteRequest
from app.models.quote import Quote
from app.models.provider import Provider
from app.api.v1.endpoints.admin.auth import get_current_admin

router = APIRouter()


# === SCHEMAS ===

class KPIs(BaseModel):
    signups_today: int
    signups_week: int
    signups_month: int
    total_users: int
    active_quote_requests: int
    quotes_received: int
    quotes_accepted: int
    conversion_rate: float
    avg_response_time_hours: float
    total_savings_estimated: float

class FunnelStage(BaseModel):
    stage: str
    count: int
    percentage: float

class TrendDataPoint(BaseModel):
    date: str
    count: int

class CategoryBreakdown(BaseModel):
    category: str
    count: int
    percentage: float

class ProviderPerformance(BaseModel):
    provider_id: str
    provider_name: str
    leads_sent: int
    deals_won: int
    conversion_rate: float
    avg_response_hours: float
    reputation_score: int


# === ENDPOINTS ===

@router.get("/kpis", response_model=KPIs)
async def get_kpis(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Get key performance indicators"""
    now = datetime.utcnow()
    today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    # Signups
    signups_today = await db.execute(
        select(func.count(User.id)).where(User.created_at >= today)
    )
    signups_today_count = signups_today.scalar() or 0
    
    signups_week = await db.execute(
        select(func.count(User.id)).where(User.created_at >= week_ago)
    )
    signups_week_count = signups_week.scalar() or 0
    
    signups_month = await db.execute(
        select(func.count(User.id)).where(User.created_at >= month_ago)
    )
    signups_month_count = signups_month.scalar() or 0
    
    total_users = await db.execute(select(func.count(User.id)))
    total_users_count = total_users.scalar() or 0
    
    # Quote requests
    active_requests = await db.execute(
        select(func.count(QuoteRequest.id)).where(
            QuoteRequest.status.in_(["pending", "in_progress"])
        )
    )
    active_requests_count = active_requests.scalar() or 0
    
    # Quotes
    quotes_received = await db.execute(select(func.count(Quote.id)))
    quotes_received_count = quotes_received.scalar() or 0
    
    quotes_accepted = await db.execute(
        select(func.count(Quote.id)).where(Quote.status == "accepted")
    )
    quotes_accepted_count = quotes_accepted.scalar() or 0
    
    # Conversion rate
    total_requests = await db.execute(select(func.count(QuoteRequest.id)))
    total_requests_count = total_requests.scalar() or 0
    conversion_rate = (quotes_accepted_count / total_requests_count * 100) if total_requests_count > 0 else 0
    
    # Average response time from providers
    avg_response = await db.execute(
        select(func.avg(Provider.avg_response_time_hours)).where(Provider.is_active == True)
    )
    avg_response_hours = avg_response.scalar() or 0
    
    # Estimated savings (mock calculation)
    total_savings = quotes_accepted_count * 1500  # Average savings per accepted quote
    
    return KPIs(
        signups_today=signups_today_count,
        signups_week=signups_week_count,
        signups_month=signups_month_count,
        total_users=total_users_count,
        active_quote_requests=active_requests_count,
        quotes_received=quotes_received_count,
        quotes_accepted=quotes_accepted_count,
        conversion_rate=round(conversion_rate, 1),
        avg_response_time_hours=round(avg_response_hours, 1),
        total_savings_estimated=total_savings
    )


@router.get("/funnel", response_model=List[FunnelStage])
async def get_funnel(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin),
    days: int = Query(30, description="Number of days to analyze")
):
    """Get conversion funnel data"""
    cutoff = datetime.utcnow() - timedelta(days=days)
    
    # Stage 1: Signups
    signups = await db.execute(
        select(func.count(User.id)).where(User.created_at >= cutoff)
    )
    signups_count = signups.scalar() or 0
    
    # Stage 2: Onboarding completed
    onboarded = await db.execute(
        select(func.count(User.id)).where(
            and_(User.created_at >= cutoff, User.onboarding_completed == True)
        )
    )
    onboarded_count = onboarded.scalar() or 0
    
    # Stage 3: Quote requested
    requested = await db.execute(
        select(func.count(func.distinct(QuoteRequest.user_id))).where(
            QuoteRequest.created_at >= cutoff
        )
    )
    requested_count = requested.scalar() or 0
    
    # Stage 4: Quote received
    received = await db.execute(
        select(func.count(func.distinct(Quote.user_id))).where(
            Quote.created_at >= cutoff
        )
    )
    received_count = received.scalar() or 0
    
    # Stage 5: Quote accepted
    accepted = await db.execute(
        select(func.count(func.distinct(Quote.user_id))).where(
            and_(Quote.created_at >= cutoff, Quote.status == "accepted")
        )
    )
    accepted_count = accepted.scalar() or 0
    
    base = signups_count if signups_count > 0 else 1
    
    return [
        FunnelStage(stage="Signup", count=signups_count, percentage=100.0),
        FunnelStage(stage="Onboarding Completed", count=onboarded_count, percentage=round(onboarded_count/base*100, 1)),
        FunnelStage(stage="Quote Requested", count=requested_count, percentage=round(requested_count/base*100, 1)),
        FunnelStage(stage="Quote Received", count=received_count, percentage=round(received_count/base*100, 1)),
        FunnelStage(stage="Quote Accepted", count=accepted_count, percentage=round(accepted_count/base*100, 1)),
    ]


@router.get("/signups/trend", response_model=List[TrendDataPoint])
async def get_signups_trend(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin),
    days: int = Query(30, description="Number of days")
):
    """Get signup trend over time"""
    data = []
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    for i in range(days - 1, -1, -1):
        date = today - timedelta(days=i)
        next_date = date + timedelta(days=1)
        
        count_result = await db.execute(
            select(func.count(User.id)).where(
                and_(User.created_at >= date, User.created_at < next_date)
            )
        )
        count = count_result.scalar() or 0
        
        data.append(TrendDataPoint(
            date=date.strftime("%Y-%m-%d"),
            count=count
        ))
    
    return data


@router.get("/categories", response_model=List[CategoryBreakdown])
async def get_category_breakdown(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Get breakdown by category"""
    # Get all contracts grouped by category
    result = await db.execute(
        select(Contract.category, func.count(Contract.id))
        .group_by(Contract.category)
    )
    categories = result.all()
    
    total = sum(count for _, count in categories) if categories else 1
    
    return [
        CategoryBreakdown(
            category=category or "unknown",
            count=count,
            percentage=round(count/total*100, 1)
        )
        for category, count in categories
    ]


@router.get("/providers/performance", response_model=List[ProviderPerformance])
async def get_providers_performance(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin),
    limit: int = Query(10, description="Number of providers")
):
    """Get provider performance ranking"""
    result = await db.execute(
        select(Provider)
        .where(Provider.is_active == True)
        .order_by(desc(Provider.reputation_score))
        .limit(limit)
    )
    providers = result.scalars().all()
    
    return [
        ProviderPerformance(
            provider_id=p.id,
            provider_name=p.name,
            leads_sent=p.total_leads_sent,
            deals_won=p.total_deals_won,
            conversion_rate=round((p.total_deals_won / p.total_leads_sent * 100) if p.total_leads_sent > 0 else 0, 1),
            avg_response_hours=round(p.avg_response_time_hours, 1),
            reputation_score=p.reputation_score
        )
        for p in providers
    ]





