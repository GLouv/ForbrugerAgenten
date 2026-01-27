"""
Email AI Agent - Handles automated email analysis and responses
"""
import os
from typing import Dict, Any, Optional, List
from openai import AsyncOpenAI
import logging
import json

logger = logging.getLogger(__name__)


class EmailAgent:
    """
    AI Agent for analyzing and responding to emails from providers
    
    Responsibilities:
    1. Parse inbound emails to extract quote data
    2. Classify email type (quote, question, rejection, etc.)
    3. Generate appropriate responses
    4. Flag emails that need human review
    """
    
    def __init__(self):
        """Initialize OpenAI client"""
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.warning("⚠️ OPENAI_API_KEY not configured - AI email features disabled")
            self.client = None
        else:
            self.client = AsyncOpenAI(api_key=api_key)
            logger.info("✅ Email AI Agent initialized")
    
    async def analyze_email(
        self,
        from_email: str,
        subject: str,
        body: str,
        provider_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Analyze inbound email from provider
        
        Returns:
            {
                "email_type": "quote" | "question" | "rejection" | "info" | "marketing",
                "requires_human": bool,
                "confidence": 0.0-1.0,
                "extracted_data": {...},  # Quote data if applicable
                "suggested_response": str | None,
                "summary": str
            }
        """
        if not self.client:
            return {
                "email_type": "info",
                "requires_human": True,
                "confidence": 0.0,
                "summary": "AI not configured - manual review required"
            }
        
        try:
            prompt = f"""
Du er en AI agent for ForbrugerAgenten som analyserer emails fra danske selskaber.

EMAIL FRA: {from_email}
SELSKAB: {provider_name or "Ukendt"}
EMNE: {subject}
INDHOLD:
{body[:2000]}  # Limit to first 2000 chars

ANALYSER EMAILEN OG RETURNER JSON:
{{
    "email_type": "quote" | "question" | "rejection" | "info" | "marketing",
    "requires_human": true/false,
    "confidence": 0.0-1.0,
    "extracted_data": {{
        // Hvis det er et tilbud, udtræk:
        "monthly_price": number | null,
        "annual_price": number | null,
        "contract_length": string | null,
        "start_date": string | null,
        "terms_url": string | null
    }},
    "summary": "Kort dansk sammenfatning af emailen (max 100 ord)",
    "suggested_response": "Foreslået svar hvis relevant, eller null"
}}

REGLER:
- email_type="quote" hvis der er konkrete priser/tilbud
- email_type="question" hvis de spørger om noget
- email_type="rejection" hvis de afviser eller ikke kan hjælpe
- requires_human=true hvis det er komplekst, uklart eller kræver menneskelig beslutning
- confidence lav hvis du er usikker
"""
            
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "Du er en dansk AI email assistent. Svar altid på dansk. Returner kun valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            logger.info(f"✅ Email analyzed: {result['email_type']} (confidence: {result['confidence']})")
            return result
            
        except Exception as e:
            logger.error(f"❌ Email analysis error: {str(e)}")
            return {
                "email_type": "info",
                "requires_human": True,
                "confidence": 0.0,
                "summary": f"Fejl ved analyse: {str(e)}"
            }
    
    async def generate_response(
        self,
        original_email: str,
        response_type: str,
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Generate appropriate response to provider email
        
        Args:
            original_email: The email we're responding to
            response_type: "accept_quote" | "ask_question" | "reject" | "request_info"
            context: Additional context for response
            
        Returns:
            Generated email response in Danish
        """
        if not self.client:
            return "AI ikke konfigureret - kan ikke generere svar automatisk."
        
        try:
            prompts = {
                "accept_quote": """
Skriv en professionel dansk email der:
1. Takker for tilbuddet
2. Bekræfter at brugeren er interesseret
3. Spørger til næste skridt for at komme i gang
""",
                "ask_question": f"""
Skriv en professionel dansk email der:
1. Henviser til deres tidligere email
2. Stiller følgende spørgsmål: {context.get('question', 'Se vedlagte')}
3. Er høflig og professionel
""",
                "reject": """
Skriv en professionel dansk email der:
1. Takker for deres tid
2. Forklarer at brugeren har valgt et andet tilbud
3. Er høflig og åben for fremtidige tilbud
""",
                "request_info": f"""
Skriv en professionel dansk email der:
1. Forklarer hvad vi har brug for: {context.get('needed_info', 'Yderligere information')}
2. Er klar og specifik
3. Nævner deadline hvis relevant
"""
            }
            
            prompt = prompts.get(response_type, prompts["ask_question"])
            
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "Du er en professionel dansk email assistent for ForbrugerAgenten."},
                    {"role": "user", "content": f"""
ORIGINAL EMAIL:
{original_email[:1000]}

{prompt}

Skriv emailen nu (kun email body, ingen emne-linje):
"""}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            logger.error(f"❌ Response generation error: {str(e)}")
            return f"Fejl ved generering af svar: {str(e)}"
    
    async def should_auto_respond(
        self,
        email_analysis: Dict[str, Any],
        user_preferences: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Determine if we should auto-respond to this email
        
        Rules:
        - Never auto-respond to quotes (user needs to approve)
        - Auto-respond to simple questions if confidence > 0.8
        - Auto-respond to rejections (thank you message)
        - Respect user preferences
        """
        email_type = email_analysis.get("email_type")
        confidence = email_analysis.get("confidence", 0.0)
        requires_human = email_analysis.get("requires_human", True)
        
        # Never auto-respond to quotes
        if email_type == "quote":
            return False
        
        # Never auto-respond if flagged for human review
        if requires_human:
            return False
        
        # Check user preferences
        if user_preferences and not user_preferences.get("allow_ai_auto_respond", False):
            return False
        
        # Auto-respond to high-confidence simple messages
        if email_type in ["rejection", "info"] and confidence > 0.8:
            return True
        
        # Default: don't auto-respond
        return False


# Global email agent instance
email_agent = EmailAgent()
