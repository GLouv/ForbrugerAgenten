import asyncio
from datetime import datetime, timedelta
from sqlalchemy import select, update
from app.core.database import AsyncSessionLocal
from app.models.support import SupportTicket
from app.models.provider import Provider
from app.services.email_service import email_service

async def run_nudge_bot():
    """
    Daily job to nudge providers who haven't replied.
    """
    print("🤖 Nudge Bot starting...")
    
    async with AsyncSessionLocal() as db:
        # 1. Get stale tickets
        three_days_ago = datetime.utcnow() - timedelta(days=3)
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        
        # Reminder (3-7 days)
        query = select(SupportTicket).where(
            SupportTicket.status == "waiting_for_provider",
            SupportTicket.updated_at < three_days_ago,
            SupportTicket.updated_at > seven_days_ago
        )
        tickets = (await db.execute(query)).scalars().all()
        
        for t in tickets:
            print(f"  -> Nudging provider for ticket {t.id}")
            # Logic to send email would go here
            # await email_service.send_email(...)
            
        # Warning (7+ days)
        query_warn = select(SupportTicket).where(
            SupportTicket.status == "waiting_for_provider",
            SupportTicket.updated_at <= seven_days_ago
        )
        tickets_warn = (await db.execute(query_warn)).scalars().all()
        
        for t in tickets_warn:
            print(f"  -> WARNING provider for ticket {t.id}")
            # Flag provider
            if t.provider_id:
                await db.execute(
                    update(Provider)
                    .where(Provider.id == t.provider_id)
                    .values(is_slow_responder=True, reputation_score=Provider.reputation_score - 5)
                )
                
        await db.commit()
    
    print("🤖 Nudge Bot finished.")

if __name__ == "__main__":
    asyncio.run(run_nudge_bot())





