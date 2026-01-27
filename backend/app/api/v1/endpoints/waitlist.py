from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.waitlist import WaitlistEntry
from app.schemas.waitlist import WaitlistCreate, WaitlistResponse
# from app.api.v1.endpoints.admin.auth import get_current_admin
from app.services.email_sender import email_sender
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=List[WaitlistResponse])
async def get_waitlist(
    db: AsyncSession = Depends(get_db),
    # admin = Depends(get_current_admin),
    skip: int = 0,
    limit: int = 100
):
    """
    Get all waitlist entries (Admin only).
    """
    result = await db.execute(
        select(WaitlistEntry)
        .order_by(WaitlistEntry.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    entries = result.scalars().all()
    return entries

@router.post("/", response_model=WaitlistResponse, status_code=status.HTTP_201_CREATED)
async def join_waitlist(
    entry_in: WaitlistCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Join the waitlist for the app.
    """
    # Optional: Check if already exists by phone (simple check)
    result = await db.execute(
        select(WaitlistEntry).where(WaitlistEntry.phone == entry_in.phone)
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        # We can just return the existing entry to be idempotent and avoid error on frontend
        logger.info(f"Duplicate waitlist entry attempted: {entry_in.phone}")
        return existing
        
    db_entry = WaitlistEntry(
        name=entry_in.name,
        phone=entry_in.phone,
        email=entry_in.email
    )
    db.add(db_entry)
    await db.commit()
    await db.refresh(db_entry)
    
    logger.info(f"New waitlist entry: {entry_in.name} - {entry_in.phone}")
    
    # Send notification email to admin (non-blocking)
    background_tasks.add_task(
        send_waitlist_notification,
        name=entry_in.name,
        phone=entry_in.phone,
        email=entry_in.email
    )
    
    return db_entry


def send_waitlist_notification(name: str, phone: str, email: str = None):
    """Send email notification - runs in background"""
    try:
        logger.info(f"Attempting to send waitlist notification email for {name}")
        success = email_sender.send_email(
            to_email="gustav@agent360.dk",
            subject=f"Ny tilmelding til venteliste: {name}",
            body=f"En ny bruger har tilmeldt sig ventelisten:\n\nNavn: {name}\nTelefon: {phone}\nEmail: {email or 'Ikke angivet'}",
            html_body=f"""
            <h2>Ny tilmelding til venteliste 🎉</h2>
            <p>En ny bruger har tilmeldt sig ventelisten på forbrugeragenten.dk:</p>
            <ul>
                <li><strong>Navn:</strong> {name}</li>
                <li><strong>Telefon:</strong> {phone}</li>
                <li><strong>Email:</strong> {email or 'Ikke angivet'}</li>
            </ul>
            """
        )
        if success:
            logger.info(f"Waitlist notification sent successfully for {name}")
        else:
            logger.warning(f"Failed to send waitlist notification for {name}")
    except Exception as e:
        logger.error(f"Error sending waitlist notification: {e}")
