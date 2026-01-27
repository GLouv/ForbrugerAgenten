"""Quotes endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.database import get_db
from app.models.quote import Quote
from app.models.quote_request import QuoteRequest
from app.schemas.quote import QuoteCreate, QuoteResponse
from app.schemas.quote_request import QuoteRequestCreate, QuoteRequestResponse

router = APIRouter()

# --- Quote Requests ---

@router.post("/requests", response_model=QuoteRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_quote_request(
    request_data: QuoteRequestCreate,
    user_id: str,  # TODO: get from auth
    db: AsyncSession = Depends(get_db)
):
    """Create a new quote request"""
    # TODO: Trigger email sending logic here
    quote_request = QuoteRequest(**request_data.model_dump(), user_id=user_id)
    db.add(quote_request)
    await db.commit()
    await db.refresh(quote_request)
    return quote_request

@router.get("/requests", response_model=List[QuoteRequestResponse])
async def get_quote_requests(
    user_id: str,  # TODO: get from auth
    db: AsyncSession = Depends(get_db)
):
    """Get all quote requests for user"""
    result = await db.execute(select(QuoteRequest).where(QuoteRequest.user_id == user_id))
    return result.scalars().all()

# --- Quotes ---

@router.get("/", response_model=List[QuoteResponse])
async def get_quotes(
    user_id: str,  # TODO: get from auth
    db: AsyncSession = Depends(get_db)
):
    """Get all received quotes"""
    result = await db.execute(select(Quote).where(Quote.user_id == user_id))
    return result.scalars().all()

@router.post("/", response_model=QuoteResponse)  # Internal/Admin use mainly
async def create_quote(
    quote_data: QuoteCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a quote (usually via email parsing webhook)"""
    quote = Quote(**quote_data.model_dump())
    db.add(quote)
    await db.commit()
    await db.refresh(quote)
    return quote





