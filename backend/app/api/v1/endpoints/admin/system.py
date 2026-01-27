"""Admin System Health Endpoints"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.models.user import User
from app.models.contract import Contract
from app.models.provider import Provider
from app.models.quote_request import QuoteRequest
from app.models.email_log import EmailLog
from app.models.support import SupportTicket
from app.api.v1.endpoints.admin.auth import get_current_admin

router = APIRouter()


# === SCHEMAS ===

class ComponentHealth(BaseModel):
    name: str
    status: str  # "healthy", "degraded", "unhealthy"
    message: Optional[str] = None
    last_check: datetime

class SystemHealth(BaseModel):
    overall_status: str
    components: List[ComponentHealth]
    uptime_seconds: int

class TableStats(BaseModel):
    table_name: str
    row_count: int

class DatabaseHealth(BaseModel):
    status: str
    tables: List[TableStats]
    total_rows: int

class EmailStats(BaseModel):
    total_sent: int
    sent_today: int
    sent_week: int
    failed: int
    delivery_rate: float

class JobStatus(BaseModel):
    job_name: str
    status: str  # "running", "idle", "failed"
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    last_error: Optional[str] = None


# Track server start time
SERVER_START_TIME = datetime.utcnow()


# === ENDPOINTS ===

@router.get("/health", response_model=SystemHealth)
async def get_system_health(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Get overall system health"""
    components = []
    
    # Database health
    try:
        await db.execute(text("SELECT 1"))
        components.append(ComponentHealth(
            name="Database",
            status="healthy",
            message="PostgreSQL connected",
            last_check=datetime.utcnow()
        ))
    except Exception as e:
        components.append(ComponentHealth(
            name="Database",
            status="unhealthy",
            message=str(e),
            last_check=datetime.utcnow()
        ))
    
    # API health (if we're here, it's healthy)
    components.append(ComponentHealth(
        name="API",
        status="healthy",
        message="FastAPI running",
        last_check=datetime.utcnow()
    ))
    
    # Email service health (check if we have recent successful sends)
    try:
        recent_emails = await db.execute(
            select(func.count(EmailLog.id)).where(
                EmailLog.created_at >= datetime.utcnow() - timedelta(hours=24)
            )
        )
        email_count = recent_emails.scalar() or 0
        components.append(ComponentHealth(
            name="Email Service",
            status="healthy" if email_count > 0 else "degraded",
            message=f"{email_count} emails in last 24h",
            last_check=datetime.utcnow()
        ))
    except Exception as e:
        components.append(ComponentHealth(
            name="Email Service",
            status="unhealthy",
            message=str(e),
            last_check=datetime.utcnow()
        ))
    
    # Determine overall status
    statuses = [c.status for c in components]
    if "unhealthy" in statuses:
        overall = "unhealthy"
    elif "degraded" in statuses:
        overall = "degraded"
    else:
        overall = "healthy"
    
    uptime = int((datetime.utcnow() - SERVER_START_TIME).total_seconds())
    
    return SystemHealth(
        overall_status=overall,
        components=components,
        uptime_seconds=uptime
    )


@router.get("/database", response_model=DatabaseHealth)
async def get_database_health(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Get database statistics"""
    tables = []
    total = 0
    
    # Count rows in each table
    table_models = [
        ("users", User),
        ("contracts", Contract),
        ("providers", Provider),
        ("quote_requests", QuoteRequest),
        ("email_logs", EmailLog),
        ("support_tickets", SupportTicket),
    ]
    
    for table_name, model in table_models:
        try:
            count_result = await db.execute(select(func.count(model.id)))
            count = count_result.scalar() or 0
            tables.append(TableStats(table_name=table_name, row_count=count))
            total += count
        except:
            tables.append(TableStats(table_name=table_name, row_count=0))
    
    return DatabaseHealth(
        status="healthy",
        tables=tables,
        total_rows=total
    )


@router.get("/emails/stats", response_model=EmailStats)
async def get_email_stats(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Get email delivery statistics"""
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = today - timedelta(days=7)
    
    # Total sent
    total = await db.execute(select(func.count(EmailLog.id)))
    total_count = total.scalar() or 0
    
    # Sent today
    today_count_result = await db.execute(
        select(func.count(EmailLog.id)).where(EmailLog.created_at >= today)
    )
    today_count = today_count_result.scalar() or 0
    
    # Sent this week
    week_count_result = await db.execute(
        select(func.count(EmailLog.id)).where(EmailLog.created_at >= week_ago)
    )
    week_count = week_count_result.scalar() or 0
    
    # Failed (not sent and not scaffolded)
    failed_result = await db.execute(
        select(func.count(EmailLog.id)).where(
            EmailLog.sent == False,
            EmailLog.is_scaffolded == False
        )
    )
    failed_count = failed_result.scalar() or 0
    
    # Delivery rate
    sent_count_result = await db.execute(
        select(func.count(EmailLog.id)).where(EmailLog.sent == True)
    )
    sent_count = sent_count_result.scalar() or 0
    delivery_rate = (sent_count / total_count * 100) if total_count > 0 else 100.0
    
    return EmailStats(
        total_sent=total_count,
        sent_today=today_count,
        sent_week=week_count,
        failed=failed_count,
        delivery_rate=round(delivery_rate, 1)
    )


@router.get("/jobs", response_model=List[JobStatus])
async def get_job_statuses(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Get background job statuses"""
    # In production, this would query a job queue like Celery or APScheduler
    # For now, return mock data
    jobs = [
        JobStatus(
            job_name="nudge_bot",
            status="idle",
            last_run=datetime.utcnow() - timedelta(hours=1),
            next_run=datetime.utcnow() + timedelta(hours=23),
            last_error=None
        ),
        JobStatus(
            job_name="spot_price_sync",
            status="idle",
            last_run=datetime.utcnow() - timedelta(minutes=30),
            next_run=datetime.utcnow() + timedelta(minutes=30),
            last_error=None
        ),
        JobStatus(
            job_name="email_processor",
            status="running",
            last_run=datetime.utcnow() - timedelta(seconds=30),
            next_run=None,
            last_error=None
        )
    ]
    return jobs


@router.post("/jobs/{job_name}/run")
async def trigger_job(
    job_name: str,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    """Manually trigger a background job"""
    valid_jobs = ["nudge_bot", "spot_price_sync", "email_processor"]
    
    if job_name not in valid_jobs:
        return {"status": "error", "message": f"Unknown job: {job_name}"}
    
    # In production, this would actually trigger the job
    # For now, just return success
    return {
        "status": "success",
        "message": f"Job {job_name} triggered",
        "triggered_at": datetime.utcnow().isoformat()
    }





