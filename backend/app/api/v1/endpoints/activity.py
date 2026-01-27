"""Activity endpoints"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.support_service import SupportService

router = APIRouter()
support_service = SupportService()

@router.get("/")
async def get_activity_feed(
    user_id: str, # TODO: Auth
    db: AsyncSession = Depends(get_db)
):
    """Get aggregated activity feed"""
    feed = await support_service.get_activity_feed(db, user_id)
    return feed





