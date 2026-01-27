"""
Authentication Service - Magic Link Email Authentication
Simple, secure authentication via email links
"""
import os
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
import logging

from app.services.email_service import email_service

logger = logging.getLogger(__name__)


class AuthService:
    """
    Email Magic Link Authentication Service
    
    Flow:
    1. User requests login with email
    2. We generate a secure token
    3. We send magic link via email
    4. User clicks link
    5. We verify token and create session
    """
    
    # Token expiry (15 minutes)
    TOKEN_EXPIRY_MINUTES = 15
    
    # Session expiry (7 days)
    SESSION_EXPIRY_DAYS = 7
    
    def generate_magic_token(self) -> tuple[str, str]:
        """
        Generate a secure magic link token
        
        Returns:
            (token, hashed_token): Token to send in email, hashed version to store
        """
        # Generate cryptographically secure random token
        token = secrets.token_urlsafe(32)
        
        # Hash it for storage (never store raw tokens)
        hashed = hashlib.sha256(token.encode()).hexdigest()
        
        return token, hashed
    
    def generate_session_token(self) -> str:
        """Generate a secure session token"""
        return secrets.token_urlsafe(32)
    
    async def request_magic_link(
        self,
        email: str,
        base_url: str,
        db: AsyncSession
    ) -> bool:
        """
        Send magic link to user's email
        
        Args:
            email: User's email address
            base_url: Frontend base URL (e.g., https://app.forbrugeragent.dk)
            db: Database session
            
        Returns:
            bool: True if email sent successfully
        """
        from app.models.user import User, MagicLink
        
        # Check if user exists, create if not
        result = await db.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            # Create new user
            user = User(
                email=email,
                is_active=True,
                created_at=datetime.utcnow()
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
            logger.info(f"✅ New user created: {email}")
            
            # ✅ BATCH 1.2: Generate agent_email for new users
            from app.services.agent_mail_service import AgentMailService
            agent_mail_service = AgentMailService()
            user.agent_email = await agent_mail_service.generate_unique_email(
                user_name=email.split('@')[0],  # Use email prefix as fallback name
                db=db
            )
            await db.commit()
            await db.refresh(user)
            logger.info(f"✅ Generated agent_email for new user: {user.agent_email}")
        
        # Generate magic token
        token, hashed_token = self.generate_magic_token()
        
        # Store magic link in database
        magic_link = MagicLink(
            user_id=user.id,
            token_hash=hashed_token,
            expires_at=datetime.utcnow() + timedelta(minutes=self.TOKEN_EXPIRY_MINUTES),
            used=False
        )
        db.add(magic_link)
        await db.commit()
        
        # Build magic link URL
        magic_url = f"{base_url}/auth/verify?token={token}&email={email}"
        
        # Send email
        subject = "Log ind på ForbrugerAgenten 🔐"
        body = f"""
Hej!

Klik på linket nedenfor for at logge ind på ForbrugerAgenten:

{magic_url}

Dette link udløber om {self.TOKEN_EXPIRY_MINUTES} minutter.

Hvis du ikke har anmodet om dette login, kan du ignorere denne email.

Med venlig hilsen,
ForbrugerAgenten
"""
        
        body_html = f"""
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Log ind på ForbrugerAgenten 🔐</h1>
    </div>
    
    <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">Hej!</p>
        
        <p style="font-size: 16px; color: #333;">
            Klik på knappen nedenfor for at logge ind:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{magic_url}" style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Log ind nu
            </a>
        </div>
        
        <p style="font-size: 14px; color: #777;">
            Dette link udløber om <strong>{self.TOKEN_EXPIRY_MINUTES} minutter</strong>.
        </p>
        
        <p style="font-size: 14px; color: #777;">
            Hvis du ikke har anmodet om dette login, kan du ignorere denne email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #999;">
            Med venlig hilsen,<br>
            ForbrugerAgenten
        </p>
    </div>
</body>
</html>
"""
        
        success = await email_service.send_email(
            to_email=email,
            subject=subject,
            body_text=body,
            body_html=body_html
        )
        
        if success:
            logger.info(f"✅ Magic link sent to: {email}")
        else:
            logger.error(f"❌ Failed to send magic link to: {email}")
        
        return success
    
    async def verify_magic_link(
        self,
        email: str,
        token: str,
        db: AsyncSession
    ) -> Optional[Dict[str, Any]]:
        """
        Verify magic link token and create session
        
        Args:
            email: User's email
            token: Magic link token from URL
            db: Database session
            
        Returns:
            Dict with user data and session token, or None if invalid
        """
        from app.models.user import User, MagicLink, Session
        
        # Get user
        result = await db.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            logger.warning(f"❌ User not found: {email}")
            return None
        
        # Hash the provided token
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        # Find matching magic link
        result = await db.execute(
            select(MagicLink).where(
                MagicLink.user_id == user.id,
                MagicLink.token_hash == token_hash,
                MagicLink.used == False,
                MagicLink.expires_at > datetime.utcnow()
            )
        )
        magic_link = result.scalar_one_or_none()
        
        if not magic_link:
            logger.warning(f"❌ Invalid or expired token for: {email}")
            return None
        
        # Mark magic link as used
        magic_link.used = True
        magic_link.used_at = datetime.utcnow()
        
        # Create session
        session_token = self.generate_session_token()
        session = Session(
            user_id=user.id,
            token=session_token,
            expires_at=datetime.utcnow() + timedelta(days=self.SESSION_EXPIRY_DAYS),
            created_at=datetime.utcnow()
        )
        db.add(session)
        
        # Update user last login
        user.last_login_at = datetime.utcnow()
        
        await db.commit()
        await db.refresh(user)
        
        logger.info(f"✅ User logged in: {email}")
        
        return {
            "user_id": user.id,
            "email": user.email,
            "name": user.name,
            "session_token": session_token,
            "expires_at": session.expires_at.isoformat(),
            "onboarding_complete": user.onboarding_complete
        }
    
    async def verify_session(
        self,
        session_token: str,
        db: AsyncSession
    ) -> Optional[Dict[str, Any]]:
        """
        Verify if session is valid
        
        Args:
            session_token: Session token from cookie/header
            db: Database session
            
        Returns:
            Dict with user data if valid, None otherwise
        """
        from app.models.user import User, Session
        
        # Find session
        result = await db.execute(
            select(Session).where(
                Session.token == session_token,
                Session.expires_at > datetime.utcnow(),
                Session.revoked == False
            )
        )
        session = result.scalar_one_or_none()
        
        if not session:
            return None
        
        # Get user
        result = await db.execute(
            select(User).where(User.id == session.user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user or not user.is_active:
            return None
        
        # Update last activity
        session.last_activity_at = datetime.utcnow()
        await db.commit()
        
        return {
            "user_id": user.id,
            "email": user.email,
            "name": user.name,
            "onboarding_complete": user.onboarding_complete
        }
    
    async def logout(
        self,
        session_token: str,
        db: AsyncSession
    ) -> bool:
        """
        Logout user by revoking session
        
        Args:
            session_token: Session token to revoke
            db: Database session
            
        Returns:
            bool: True if successful
        """
        from app.models.user import Session
        
        result = await db.execute(
            select(Session).where(Session.token == session_token)
        )
        session = result.scalar_one_or_none()
        
        if session:
            session.revoked = True
            session.revoked_at = datetime.utcnow()
            await db.commit()
            logger.info(f"✅ User logged out: {session.user_id}")
            return True
        
        return False


# Global auth service instance
auth_service = AuthService()
