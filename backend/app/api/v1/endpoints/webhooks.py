"""
Webhook Endpoints - For external services (SendGrid, Criipto, etc.)
"""
from fastapi import APIRouter, Request, HTTPException, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Dict, Any
import logging
from datetime import datetime
import json
import uuid

from app.core.database import get_db
from app.models.message import Message
from app.models.provider import Provider
from app.services.email_service import email_service
from app.agents.email_flow_handler import email_flow_handler

logger = logging.getLogger(__name__)
router = APIRouter()


async def process_email_flow(message_id: str, user_id: str):
    """
    Background task to process email with AI flow handler
    """
    try:
        from app.core.database import AsyncSessionLocal
        async with AsyncSessionLocal() as db:
            # Get message
            result = await db.execute(
                select(Message).where(Message.id == message_id)
            )
            message = result.scalar_one_or_none()
            
            if not message:
                logger.error(f"❌ Message not found: {message_id}")
                return
            
            # Process with flow handler
            result = await email_flow_handler.process_inbound_email(message, db)
            logger.info(f"✅ Email processed: {result['action_taken']}")
            
    except Exception as e:
        logger.error(f"❌ Error processing email flow: {str(e)}")
        import traceback
        traceback.print_exc()


@router.post("/sendgrid/inbound")
async def sendgrid_inbound_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Receive inbound emails from SendGrid Inbound Parse
    
    When a provider sends email to: user123@inbound.forbrugeragent.dk
    SendGrid forwards it here for processing.
    
    We:
    1. Parse the email
    2. Identify the user (from email address)
    3. Identify the provider (from sender)
    4. Store in messages table
    5. Optionally trigger AI to parse quote data
    6. Send notification to user
    """
    try:
        # SendGrid sends form-data
        form = await request.form()
        
        # Extract email metadata
        to_email = form.get("to", "")  # e.g. "user123@inbound.forbrugeragent.dk"
        from_email = form.get("from", "")
        subject = form.get("subject", "")
        text_body = form.get("text", "")
        html_body = form.get("html", "")
        
        # Extract user_id from email address
        # Format: {user_id}@inbound.forbrugeragent.dk
        if "@inbound.forbrugeragent.dk" in to_email:
            user_id = to_email.split("@")[0]
        else:
            logger.warning(f"⚠️ Invalid inbound email format: {to_email}")
            return {"status": "ignored", "reason": "invalid_recipient"}
        
        logger.info(f"📧 Inbound email: {from_email} -> {user_id}")
        
        # Identify provider by email domain
        provider_id = None
        provider_name = None
        provider_email_domain = from_email.split("@")[-1] if "@" in from_email else None
        
        if provider_email_domain:
            # Try to find provider by email
            result = await db.execute(
                select(Provider).where(
                    (Provider.quote_email.like(f"%{provider_email_domain}%")) |
                    (Provider.support_email.like(f"%{provider_email_domain}%"))
                )
            )
            provider = result.scalar_one_or_none()
            if provider:
                provider_id = provider.id
                provider_name = provider.name
                logger.info(f"✅ Matched provider: {provider_name}")
        
        # If no provider match, use email domain as name
        if not provider_name:
            provider_name = provider_email_domain or from_email
        
        # Handle attachments
        attachments = []
        attachment_count = int(form.get("attachments", 0))
        for i in range(1, attachment_count + 1):
            att_file = form.get(f"attachment{i}")
            if att_file:
                # Store attachment info (not full content for now)
                attachments.append({
                    "filename": att_file.filename,
                    "content_type": att_file.content_type,
                    "size": len(await att_file.read()),
                })
        
        # Create message in inbox
        message = Message(
            id=uuid.uuid4(),
            user_id=user_id,
            provider_id=provider_id,
            provider_name=provider_name,
            subject=subject,
            body=text_body or "No text content",
            body_html=html_body,
            message_type="info",  # Default, AI can update this
            direction="inbound",
            status="unread",
            from_email=from_email,
            to_email=to_email,
            attachments=attachments,
            sent_at=datetime.utcnow(),
            received_at=datetime.utcnow(),
        )
        
        db.add(message)
        await db.commit()
        await db.refresh(message)
        
        logger.info(f"✅ Message stored: {message.id}")
        
        # Trigger AI flow handler to process email
        background_tasks.add_task(
            process_email_flow,
            message_id=str(message.id),
            user_id=user_id
        )
        
        return {
            "status": "success",
            "message_id": str(message.id),
            "user_id": user_id,
            "provider": provider_name,
            "action": "processing"
        }
        
    except Exception as e:
        logger.error(f"❌ Inbound webhook error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sendgrid/test")
async def test_sendgrid_integration():
    """Test SendGrid configuration"""
    if not email_service.client:
        return {
            "status": "not_configured",
            "message": "SENDGRID_API_KEY not set"
        }
    
    return {
        "status": "configured",
        "from_email": email_service.from_email,
        "from_name": email_service.from_name,
        "templates": {
            k: v for k, v in email_service.TEMPLATES.items()
            if v != "d-xxx"
        }
    }


@router.post("/sendgrid/test-send")
async def test_send_email(
    to_email: str,
    subject: str = "Test Email fra ForbrugerAgenten",
    body: str = "Dette er en test email. Hvis du modtager denne, virker SendGrid! 🎉"
):
    """Test sending an email (for debugging)"""
    success = await email_service.send_email(
        to_email=to_email,
        subject=subject,
        body_text=body
    )
    
    if success:
        return {"status": "sent", "to": to_email, "subject": subject}
    else:
        raise HTTPException(status_code=500, detail="Failed to send email")
