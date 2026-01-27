"""AI Agent endpoints"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Dict, Optional

from app.core.database import get_db
from app.agents.insurance_agent import insurance_agent

router = APIRouter()


class ChatRequest(BaseModel):
    """Chat request"""
    message: str
    conversation_history: Optional[List[Dict[str, str]]] = None


class ChatResponse(BaseModel):
    """Chat response"""
    response: str


@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(
    request: ChatRequest,
    user_id: str,  # TODO: Get from auth token
    db: AsyncSession = Depends(get_db)
):
    """
    Chat with AI insurance agent
    """
    # TODO: Load user context (policies, properties, vehicles)
    # For now, send without context
    
    response = await insurance_agent.chat(
        message=request.message,
        conversation_history=request.conversation_history
    )
    
    return ChatResponse(response=response)


@router.post("/damage-claim-guidance")
async def get_damage_claim_guidance(
    insurance_company: str,
    policy_type: str,
    damage_description: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get AI guidance for filing a damage claim
    """
    guidance = await insurance_agent.generate_damage_claim_guidance(
        insurance_company=insurance_company,
        policy_type=policy_type,
        damage_description=damage_description
    )
    
    return {"guidance": guidance}

