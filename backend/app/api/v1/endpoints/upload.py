"""
Upload API Endpoints
Handle file uploads for bill parsing
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
import logging

from app.core.database import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.services.bill_parser_service import BillParserService
from app.models.contract import Contract

logger = logging.getLogger(__name__)
router = APIRouter()


# ============== Pydantic Schemas ==============

class UploadResponse(BaseModel):
    """Response after successful upload"""
    success: bool
    message: str
    contract_id: Optional[str] = None
    parsed_data: Optional[dict] = None


class ContractResponse(BaseModel):
    """Contract data response"""
    id: str
    category: str
    provider: str
    name: Optional[str]
    monthly_price: Optional[float]
    currency: str
    status: str


# ============== Upload Endpoints ==============

@router.post("/bill", response_model=UploadResponse)
async def upload_bill(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload and parse a bill/invoice
    
    ✅ BATCH 2.2: Bill upload with AI parsing
    
    This endpoint:
    1. Accepts image file (jpg, png, pdf)
    2. Sends to GPT-4o Vision for parsing
    3. Extracts: provider, price, category, specs
    4. Creates Contract in database
    5. Returns parsed data
    
    Supported formats: JPEG, PNG, PDF (converted to image)
    Max file size: 10MB
    """
    user_id = current_user["user_id"]
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Allowed: JPG, PNG, PDF"
        )
    
    # Validate file size (10MB max)
    file_content = await file.read()
    file_size_mb = len(file_content) / (1024 * 1024)
    
    if file_size_mb > 10:
        raise HTTPException(
            status_code=400,
            detail=f"File too large: {file_size_mb:.2f}MB. Max size: 10MB"
        )
    
    logger.info(f"📄 Processing bill upload for user {user_id}: {file.filename} ({file_size_mb:.2f}MB)")
    
    try:
        # Initialize parser service
        parser = BillParserService()
        
        # Parse the bill with AI
        parsed_data = await parser.parse_bill(
            file_content=file_content,
            file_type=file.content_type
        )
        
        if not parsed_data:
            raise HTTPException(
                status_code=500,
                detail="Failed to parse bill. Please ensure the image is clear and contains invoice information."
            )
        
        logger.info(f"✅ Bill parsed successfully: {parsed_data}")
        
        # Create contract from parsed data
        contract = await parser.create_contract_from_bill(
            db=db,
            user_id=user_id,
            parsed_data=parsed_data
        )
        
        if not contract:
            raise HTTPException(
                status_code=500,
                detail="Failed to create contract from parsed data"
            )
        
        # Update contract with file URL (if we store files)
        # For MVP, we skip file storage and just parse
        # In production, upload to S3/Azure Blob and store URL
        # contract.contract_file_url = uploaded_file_url
        # await db.commit()
        
        logger.info(f"✅ Contract created: {contract.id} - {contract.provider}")
        
        return UploadResponse(
            success=True,
            message=f"Regning uploaded og parsed! Fundet: {contract.provider} - {contract.monthly_price} kr/md",
            contract_id=contract.id,
            parsed_data=parsed_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Upload failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}"
        )


@router.get("/contracts", response_model=list[ContractResponse])
async def get_user_contracts(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all contracts for current user
    
    Returns list of contracts with basic info
    """
    from sqlalchemy import select
    
    user_id = current_user["user_id"]
    
    result = await db.execute(
        select(Contract)
        .where(Contract.user_id == user_id)
        .order_by(Contract.created_at.desc())
    )
    contracts = result.scalars().all()
    
    return [
        ContractResponse(
            id=c.id,
            category=c.category,
            provider=c.provider,
            name=c.name,
            monthly_price=float(c.monthly_price) if c.monthly_price else None,
            currency=c.currency,
            status=c.status
        )
        for c in contracts
    ]


@router.get("/contracts/{contract_id}")
async def get_contract_details(
    contract_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get detailed contract information
    
    Returns full contract data including specs
    """
    from sqlalchemy import select
    
    user_id = current_user["user_id"]
    
    result = await db.execute(
        select(Contract)
        .where(Contract.id == contract_id)
        .where(Contract.user_id == user_id)
    )
    contract = result.scalar_one_or_none()
    
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    return {
        "id": contract.id,
        "category": contract.category,
        "provider": contract.provider,
        "name": contract.name,
        "monthly_price": float(contract.monthly_price) if contract.monthly_price else None,
        "currency": contract.currency,
        "details": contract.details,
        "status": contract.status,
        "start_date": contract.start_date.isoformat() if contract.start_date else None,
        "end_date": contract.end_date.isoformat() if contract.end_date else None,
        "created_at": contract.created_at.isoformat(),
        "updated_at": contract.updated_at.isoformat() if contract.updated_at else None,
        "contract_file_url": contract.contract_file_url,
        "last_parsed_at": contract.last_parsed_at.isoformat() if contract.last_parsed_at else None
    }



