from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.support import SupportTicket
from app.models.email_log import EmailLog
from app.models.contract import Contract
from datetime import datetime

class SupportService:
    """
    Handles support tickets, activity feeds, and provider communication.
    The 'Bodyguard' logic lives here.
    """
    
    async def create_ticket(self, db: AsyncSession, user_id: str, data: dict) -> SupportTicket:
        """Create a new support ticket"""
        ticket = SupportTicket(
            user_id=user_id,
            subject=data.get("subject"),
            description=data.get("description"),
            category=data.get("category", "other"),
            contract_id=data.get("contract_id"),
            status="open",
            messages=[{
                "role": "user",
                "content": data.get("description"),
                "timestamp": datetime.utcnow().isoformat()
            }]
        )
        
        db.add(ticket)
        
        # Auto-response log
        # TODO: Send email confirmation
        
        await db.commit()
        await db.refresh(ticket)
        return ticket

    async def add_message(self, db: AsyncSession, ticket_id: str, message: str, role: str = "user"):
        """Add message to ticket conversation"""
        result = await db.execute(select(SupportTicket).where(SupportTicket.id == ticket_id))
        ticket = result.scalar_one_or_none()
        
        if not ticket:
            return None
            
        # Append message
        new_msg = {
            "role": role,
            "content": message,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # SQLAlchemy JSON mutable tracking can be tricky, so we re-assign
        messages = list(ticket.messages)
        messages.append(new_msg)
        ticket.messages = messages
        ticket.updated_at = datetime.utcnow()
        
        await db.commit()
        await db.refresh(ticket)
        return ticket

    async def get_activity_feed(self, db: AsyncSession, user_id: str, limit: int = 50):
        """
        Aggregate logs, tickets, and events into a timeline.
        """
        # 1. Get Email Logs
        emails_query = select(EmailLog).where(
            EmailLog.user_id == user_id
        ).order_by(desc(EmailLog.created_at)).limit(limit)
        emails = (await db.execute(emails_query)).scalars().all()
        
        # 2. Get Tickets (Updates)
        tickets_query = select(SupportTicket).where(
            SupportTicket.user_id == user_id
        ).order_by(desc(SupportTicket.updated_at)).limit(limit)
        tickets = (await db.execute(tickets_query)).scalars().all()
        
        # 3. Merge and Sort
        feed = []
        
        for email in emails:
            feed.append({
                "type": "email",
                "id": email.id,
                "title": f"Mail: {email.subject}",
                "description": email.provider_contact_reason or "Email kommunikation",
                "date": email.created_at,
                "status": "sent" if email.sent else "pending"
            })
            
        for ticket in tickets:
            feed.append({
                "type": "ticket",
                "id": ticket.id,
                "title": f"Sag: {ticket.subject}",
                "description": f"Status: {ticket.status}",
                "date": ticket.updated_at,
                "status": ticket.status
            })
            
        # Sort by date desc
        feed.sort(key=lambda x: x["date"], reverse=True)
        return feed[:limit]




