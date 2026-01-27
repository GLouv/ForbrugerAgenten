"""Contracts endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.database import get_db
from app.models.contract import Contract
from app.schemas.contract import ContractCreate, ContractUpdate, ContractResponse
# from app.core.auth import get_current_user  # TODO: Auth

router = APIRouter()

@router.get("/", response_model=List[ContractResponse])
async def get_contracts(
    user_id: str,  # TODO: get from auth
    db: AsyncSession = Depends(get_db)
):
    """Get all contracts for user"""
    result = await db.execute(select(Contract).where(Contract.user_id == user_id))
    contracts = result.scalars().all()
    return contracts

@router.post("/", response_model=ContractResponse, status_code=status.HTTP_201_CREATED)
async def create_contract(
    contract_data: ContractCreate,
    user_id: str,  # TODO: get from auth
    db: AsyncSession = Depends(get_db)
):
    """Create a new contract"""
    contract = Contract(**contract_data.model_dump(), user_id=user_id)
    db.add(contract)
    await db.commit()
    await db.refresh(contract)
    return contract

@router.get("/{contract_id}", response_model=ContractResponse)
async def get_contract(
    contract_id: str,
    user_id: str,  # TODO: get from auth
    db: AsyncSession = Depends(get_db)
):
    """Get contract by ID"""
    result = await db.execute(select(Contract).where(Contract.id == contract_id, Contract.user_id == user_id))
    contract = result.scalar_one_or_none()
    
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
        
    return contract

@router.patch("/{contract_id}", response_model=ContractResponse)
async def update_contract(
    contract_id: str,
    contract_update: ContractUpdate,
    user_id: str,  # TODO: get from auth
    db: AsyncSession = Depends(get_db)
):
    """Update contract"""
    result = await db.execute(select(Contract).where(Contract.id == contract_id, Contract.user_id == user_id))
    contract = result.scalar_one_or_none()
    
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
        
    for field, value in contract_update.model_dump(exclude_unset=True).items():
        setattr(contract, field, value)
        
    await db.commit()
    await db.refresh(contract)
    return contract

@router.delete("/{contract_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contract(
    contract_id: str,
    user_id: str,  # TODO: get from auth
    db: AsyncSession = Depends(get_db)
):
    """Delete contract"""
    result = await db.execute(select(Contract).where(Contract.id == contract_id, Contract.user_id == user_id))
    contract = result.scalar_one_or_none()
    
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
        
    await db.delete(contract)
    await db.commit()
    return None





