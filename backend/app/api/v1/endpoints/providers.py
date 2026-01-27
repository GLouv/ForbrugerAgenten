"""Providers endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.database import get_db
from app.models.provider import Provider
from app.schemas.provider import ProviderCreate, ProviderResponse

router = APIRouter()

@router.get("/", response_model=List[ProviderResponse])
async def get_providers(
    category: str = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all providers, optionally filtered by category"""
    query = select(Provider).where(Provider.is_active == True)
    
    # Simple filtering (in reality we need JSONB contains query)
    # logic will be handled in frontend or advanced query for now
    
    result = await db.execute(query)
    providers = result.scalars().all()
    
    if category:
        # Filter in python for now (easier with JSONB)
        providers = [p for p in providers if category in p.categories]
        
    return providers

@router.post("/", response_model=ProviderResponse, status_code=status.HTTP_201_CREATED)
async def create_provider(
    provider_data: ProviderCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new provider"""
    provider = Provider(**provider_data.model_dump())
    db.add(provider)
    await db.commit()
    await db.refresh(provider)
    return provider





