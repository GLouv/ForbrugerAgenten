import random
import string
import re
import unicodedata
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.models.contract import Contract
from app.models.support import SupportTicket, TicketType
from app.core.config import settings
import openai

class AgentMailService:
    """
    Handles the 'Digital Mailbox' logic.
    Generates unique agent emails and processes inbound mail.
    """
    
    def __init__(self):
        # Initialize OpenAI client for classification
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    def _sanitize_name(self, name: str) -> str:
        """
        Converts 'Søren Æblegård' to 'soren.aeblegard'
        """
        if not name:
            return "user"
            
        # Normalize unicode characters (æ -> ae, ø -> oe, å -> aa)
        name = name.lower()
        name = name.replace("æ", "ae").replace("ø", "oe").replace("å", "aa")
        
        # Remove accents
        name = unicodedata.normalize('NFKD', name).encode('ASCII', 'ignore').decode('utf-8')
        
        # Replace spaces/special chars with dots
        name = re.sub(r'[^a-z0-9]', '.', name)
        
        # Remove repeated dots
        name = re.sub(r'\.+', '.', name)
        
        # Strip leading/trailing dots
        return name.strip('.')

    def _generate_suffix(self, length: int = 3) -> str:
        """Generates a random suffix like 'x92' or 'a7m'"""
        chars = string.ascii_lowercase + string.digits
        return ''.join(random.choice(chars) for _ in range(length))

    async def generate_unique_email(self, db: AsyncSession, name: str, domain: str = "agent.forbrugeragenten.dk") -> str:
        """
        Generates a unique email address for the user.
        Format: firstname.lastname.suffix@domain
        Example: soren.jensen.x92@agent.forbrugeragenten.dk
        """
        base_name = self._sanitize_name(name)
        
        # Try to generate a unique email (max 10 retries)
        for _ in range(10):
            suffix = self._generate_suffix()
            email = f"{base_name}.{suffix}@{domain}"
            
            # Check if exists in DB
            result = await db.execute(select(User).filter(User.agent_email == email))
            existing_user = result.scalar_one_or_none()
            
            if not existing_user:
                return email
                
        # Fallback if extremely unlucky with collisions
        long_suffix = self._generate_suffix(length=6)
        return f"{base_name}.{long_suffix}@{domain}"
        
    async def classify_email(self, subject: str, body: str, sender: str) -> dict:
        """
        Use GPT-4o-mini to classify the email.
        """
        prompt = f"""
        Analyze this email and classify it.
        Sender: {sender}
        Subject: {subject}
        Body: {body[:1000]}... (truncated)
        
        Return a JSON object with:
        - type: One of ["bill", "welcome", "notice", "spam", "other"]
        - provider: Name of company if applicable (e.g. Norlys)
        - summary: 1 sentence summary
        
        Definitions:
        - bill: Invoice, regning, faktura, betalingsservice.
        - welcome: Ordrebekræftelse, velkommen, aftale indgået.
        - notice: Varsling, prisstigning, ændring af vilkår.
        - spam: Newsletter, marketing, tilbud.
        - other: Personal replies, questions.
        """
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Classification error: {e}")
            return {"type": "other", "provider": "Unknown", "summary": "Error classifying"}

    async def process_inbound_email(self, db: AsyncSession, email_data: dict):
        """
        Process an inbound email from webhook.
        """
        recipient = email_data.get("to", "")
        sender = email_data.get("from", "")
        subject = email_data.get("subject", "")
        body = email_data.get("text", "") or email_data.get("html", "")
        
        # 1. Identify User
        # Extract email address from recipient string (e.g. "Name <email@domain>")
        email_match = re.search(r'[\w\.-]+@agent\.forbrugeragenten\.dk', recipient)
        if not email_match:
            print(f"Could not find agent email in recipient: {recipient}")
            return # Skip if not for us
            
        agent_email = email_match.group(0)
        
        result = await db.execute(select(User).where(User.agent_email == agent_email))
        user = result.scalar_one_or_none()
        
        if not user:
            print(f"User not found for agent email: {agent_email}")
            return
            
        # 2. Log the email (EmailLog model not yet implemented, skip for now)
        # TODO: Implement EmailLog model in BATCH 4
        
        # 3. Classify
        classification = await self.classify_email(subject, body, sender)
        email_type = classification.get("type")
        provider_name = classification.get("provider")
        
        # 4. Action Logic
        if email_type == "welcome":
            # Find pending contract for this provider and activate it
            # Simplified logic: Find any contract matching provider name
            if provider_name:
                # This is a bit loose, ideally we match better
                pass 
                # Logic to update contract status would go here
                
        elif email_type == "bill":
            # Ideally parse attachment here using BillParserService
            # For now, just create a notification
            pass
            
        elif email_type == "notice":
            # Create Support Ticket
            ticket = SupportTicket(
                user_id=user.id,
                subject=f"Notice from {provider_name}: {subject}",
                description=f"Summary: {classification.get('summary')}\n\nOriginal body: {body[:500]}...",
                type=TicketType.SYSTEM_NOTICE,
                status="open",
                category="other" # Needs refinement
            )
            db.add(ticket)
            
        # 5. Forwarding Logic (TODO: Implement when User model has forwarding preferences)
        # should_forward = False
        # if email_type == "spam" and user.forward_marketing_emails:
        #     should_forward = True
        # elif email_type != "spam" and user.forward_essential_emails:
        #     should_forward = True
        #     
        # if should_forward:
        #     # Logic to forward email to user.email
        #     # send_email(to=user.email, subject=f"FW: {subject}", body=body)
        #     pass
            
        await db.commit()




