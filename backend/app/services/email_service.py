"""
Email Service - SendGrid Integration (Pure Email - No Templates)
Handles all email sending with plain text/HTML
"""
import os
from typing import Optional, Dict, Any, List
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content, HtmlContent, PlainTextContent
from python_http_client.exceptions import HTTPError
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class EmailService:
    """SendGrid email service for ForbrugerAgenten - Pure email, no templates"""
    
    def __init__(self):
        """Initialize SendGrid client"""
        self.api_key = os.getenv("SENDGRID_API_KEY")
        self.from_email = os.getenv("SENDGRID_FROM_EMAIL", "noreply@forbrugeragent.dk")
        self.from_name = os.getenv("SENDGRID_FROM_NAME", "ForbrugerAgenten")
        
        if not self.api_key:
            logger.warning("⚠️ SENDGRID_API_KEY not configured - email sending disabled")
            self.client = None
        else:
            self.client = SendGridAPIClient(self.api_key)
            logger.info("✅ SendGrid initialized")
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        body_text: str,
        body_html: Optional[str] = None,
        cc: Optional[List[str]] = None,
        bcc: Optional[List[str]] = None,
        reply_to: Optional[str] = None,
    ) -> bool:
        """
        Send pure email via SendGrid (no templates)
        
        Args:
            to_email: Recipient email
            subject: Email subject
            body_text: Plain text body
            body_html: Optional HTML body
            cc: Optional CC recipients
            bcc: Optional BCC recipients
            reply_to: Optional reply-to address
            
        Returns:
            bool: True if sent successfully
        """
        if not self.client:
            logger.error("❌ SendGrid not configured - cannot send email")
            return False
        
        try:
            # Build message
            message = Mail(
                from_email=Email(self.from_email, self.from_name),
                to_emails=To(to_email),
                subject=subject,
                plain_text_content=PlainTextContent(body_text),
                html_content=HtmlContent(body_html) if body_html else None
            )
            
            # Optional CC/BCC
            if cc:
                for cc_email in cc:
                    message.add_cc(Email(cc_email))
            if bcc:
                for bcc_email in bcc:
                    message.add_bcc(Email(bcc_email))
            
            # Optional reply-to
            if reply_to:
                message.reply_to = Email(reply_to)
            
            # Send
            response = self.client.send(message)
            
            if response.status_code in [200, 201, 202]:
                logger.info(f"✅ Email sent: {subject} -> {to_email}")
                return True
            else:
                logger.error(f"❌ SendGrid error: {response.status_code} {response.body}")
                return False
                
        except HTTPError as e:
            logger.error(f"❌ SendGrid HTTP error: {e.to_dict}")
            return False
        except Exception as e:
            logger.error(f"❌ Email send error: {str(e)}")
            return False
    
    # ============== HELPER METHODS ==============
    
    async def send_to_provider(
        self,
        provider_email: str,
        user_agent_email: str,
        subject: str,
        body: str,
        user_data: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Send request to provider on behalf of user
        Reply-to is set to user's agent email so provider responds there
        """
        return await self.send_email(
            to_email=provider_email,
            subject=subject,
            body_text=body,
            reply_to=user_agent_email,
            cc=[user_agent_email]  # User gets copy
        )
    
    async def send_to_user(
        self,
        user_email: str,
        subject: str,
        body: str,
        body_html: Optional[str] = None
    ) -> bool:
        """Send notification to user"""
        return await self.send_email(
            to_email=user_email,
            subject=subject,
            body_text=body,
            body_html=body_html
        )


# Global email service instance
email_service = EmailService()
