"""
Email Flow Handler - Orchestrates what happens when emails arrive
This is the "brain" that decides actions based on email analysis
"""
import logging
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.message import Message
from app.models.provider import Provider
from app.agents.email_agent import email_agent
from app.services.email_service import email_service

logger = logging.getLogger(__name__)


class EmailFlowHandler:
    """
    Handles the complete flow when an email arrives:
    1. Analyze with AI
    2. Decide action
    3. Execute (auto-respond, notify user, flag for review, etc.)
    """
    
    async def process_inbound_email(
        self,
        message: Message,
        db: AsyncSession
    ) -> Dict[str, Any]:
        """
        Main entry point for processing inbound emails
        
        Returns:
            {
                "action_taken": str,
                "ai_analysis": dict,
                "auto_responded": bool,
                "user_notified": bool
            }
        """
        logger.info(f"📧 Processing inbound email: {message.id}")
        
        # Step 1: Analyze email with AI
        ai_analysis = await email_agent.analyze_email(
            from_email=message.from_email,
            subject=message.subject,
            body=message.body,
            provider_name=message.provider_name
        )
        
        # Store analysis in message
        message.parsed_data = ai_analysis
        await db.commit()
        
        logger.info(f"🤖 AI Analysis: {ai_analysis['email_type']} (confidence: {ai_analysis['confidence']})")
        
        # Step 2: Decide action based on type and confidence
        action_result = await self._decide_action(message, ai_analysis, db)
        
        return {
            "action_taken": action_result["action"],
            "ai_analysis": ai_analysis,
            "auto_responded": action_result.get("auto_responded", False),
            "user_notified": action_result.get("user_notified", False),
        }
    
    async def _decide_action(
        self,
        message: Message,
        ai_analysis: Dict[str, Any],
        db: AsyncSession
    ) -> Dict[str, Any]:
        """
        Decide what action to take based on AI analysis
        
        Actions:
        - QUOTE: Notify user immediately
        - QUESTION: Flag for human review (or auto-respond if simple)
        - REJECTION: Log it, notify user politely
        - INFO: Store, notify user if important
        - MARKETING: Store, don't notify (unless user opted-in)
        """
        email_type = ai_analysis.get("email_type", "info")
        requires_human = ai_analysis.get("requires_human", True)
        confidence = ai_analysis.get("confidence", 0.0)
        
        # QUOTE from provider
        if email_type == "quote":
            return await self._handle_quote(message, ai_analysis, db)
        
        # QUESTION from provider
        elif email_type == "question":
            return await self._handle_question(message, ai_analysis, db)
        
        # REJECTION from provider
        elif email_type == "rejection":
            return await self._handle_rejection(message, ai_analysis, db)
        
        # MARKETING
        elif email_type == "marketing":
            return await self._handle_marketing(message, ai_analysis, db)
        
        # INFO (default)
        else:
            return await self._handle_info(message, ai_analysis, db)
    
    async def _handle_quote(
        self,
        message: Message,
        ai_analysis: Dict[str, Any],
        db: AsyncSession
    ) -> Dict[str, Any]:
        """
        Handle QUOTE emails from providers
        
        Action:
        1. Mark as "quote" type
        2. Notify user immediately
        3. Update message status to "unread" (user needs to see it)
        4. Update provider stats (response time)
        """
        logger.info(f"💰 QUOTE received from {message.provider_name}")
        
        # Update message type
        message.message_type = "quote"
        message.status = "unread"  # User MUST see this
        await db.commit()
        
        # TODO: Notify user via push notification
        # await notify_user_new_quote(message.user_id, message.id)
        
        # TODO: Send email to user
        # user = await get_user(message.user_id, db)
        # if user and user.email:
        #     await email_service.send_to_user(
        #         user_email=user.email,
        #         subject=f"Nyt tilbud fra {message.provider_name}",
        #         body=f"Du har modtaget et tilbud. Se det i appen: https://app.forbrugeragent.dk/inbox"
        #     )
        
        # Update provider stats
        if message.provider_id:
            await self._update_provider_response_time(message.provider_id, db)
        
        return {
            "action": "quote_received",
            "user_notified": False,  # TODO: Set to True when notification implemented
            "auto_responded": False
        }
    
    async def _handle_question(
        self,
        message: Message,
        ai_analysis: Dict[str, Any],
        db: AsyncSession
    ) -> Dict[str, Any]:
        """
        Handle QUESTION emails from providers
        
        Action:
        1. If simple + high confidence -> Auto-respond
        2. If complex -> Flag for human review
        3. Notify user
        """
        logger.info(f"❓ QUESTION received from {message.provider_name}")
        
        message.message_type = "info"
        confidence = ai_analysis.get("confidence", 0.0)
        requires_human = ai_analysis.get("requires_human", True)
        
        # High confidence simple question -> Could auto-respond
        if confidence > 0.8 and not requires_human:
            # TODO: Implement auto-response
            # suggested_response = ai_analysis.get("suggested_response")
            # if suggested_response:
            #     await email_service.send_to_provider(
            #         provider_email=message.from_email,
            #         user_agent_email=message.to_email,
            #         subject=f"Re: {message.subject}",
            #         body=suggested_response
            #     )
            #     message.status = "read"  # Handled by AI
            #     await db.commit()
            #     return {"action": "auto_responded", "auto_responded": True}
            pass
        
        # Complex or low confidence -> Human review
        message.status = "unread"
        await db.commit()
        
        return {
            "action": "flagged_for_review",
            "user_notified": False,
            "auto_responded": False
        }
    
    async def _handle_rejection(
        self,
        message: Message,
        ai_analysis: Dict[str, Any],
        db: AsyncSession
    ) -> Dict[str, Any]:
        """
        Handle REJECTION emails from providers
        
        Action:
        1. Mark provider as "rejected"
        2. Update provider reputation score (negative)
        3. Notify user politely
        4. Auto-thank provider for their time
        """
        logger.info(f"❌ REJECTION received from {message.provider_name}")
        
        message.message_type = "info"
        message.status = "read"  # No action needed from user
        await db.commit()
        
        # TODO: Auto-thank provider
        # await email_service.send_to_provider(
        #     provider_email=message.from_email,
        #     user_agent_email=message.to_email,
        #     subject="Tak for dit svar",
        #     body="Tak for dit svar. Vi håber vi kan samarbejde i fremtiden."
        # )
        
        # Update provider stats (rejection logged)
        if message.provider_id:
            result = await db.execute(
                select(Provider).where(Provider.id == message.provider_id)
            )
            provider = result.scalar_one_or_none()
            if provider:
                provider.total_leads_sent += 1
                # Don't increment deals_won (it's a rejection)
                await db.commit()
        
        return {
            "action": "rejection_logged",
            "user_notified": False,
            "auto_responded": False  # TODO: Set True when auto-thank implemented
        }
    
    async def _handle_marketing(
        self,
        message: Message,
        ai_analysis: Dict[str, Any],
        db: AsyncSession
    ) -> Dict[str, Any]:
        """
        Handle MARKETING emails
        
        Action:
        1. Check user preferences
        2. If opted-in -> Show in inbox
        3. If opted-out -> Archive immediately
        """
        logger.info(f"📢 MARKETING received from {message.provider_name}")
        
        message.message_type = "marketing"
        
        # TODO: Check user notification preferences
        # prefs = await get_user_preferences(message.user_id, db)
        # if prefs and not prefs.inbox_marketing:
        #     message.status = "archived"  # User doesn't want marketing
        # else:
        #     message.status = "unread"
        
        message.status = "archived"  # Default: don't show marketing
        await db.commit()
        
        return {
            "action": "marketing_archived",
            "user_notified": False,
            "auto_responded": False
        }
    
    async def _handle_info(
        self,
        message: Message,
        ai_analysis: Dict[str, Any],
        db: AsyncSession
    ) -> Dict[str, Any]:
        """
        Handle INFO emails (general)
        
        Action:
        1. Store in inbox
        2. Mark as unread
        3. Let user decide
        """
        logger.info(f"ℹ️ INFO email from {message.provider_name}")
        
        message.message_type = "info"
        message.status = "unread"
        await db.commit()
        
        return {
            "action": "stored_for_review",
            "user_notified": False,
            "auto_responded": False
        }
    
    async def _update_provider_response_time(
        self,
        provider_id: str,
        db: AsyncSession
    ):
        """
        Update provider's average response time
        (Called when they respond to our request)
        """
        # TODO: Calculate time from when we sent request to when they responded
        # For now, just increment total_leads_sent
        result = await db.execute(
            select(Provider).where(Provider.id == provider_id)
        )
        provider = result.scalar_one_or_none()
        if provider:
            provider.total_leads_sent += 1
            await db.commit()
            logger.info(f"✅ Updated provider stats: {provider.name}")


# Global instance
email_flow_handler = EmailFlowHandler()
