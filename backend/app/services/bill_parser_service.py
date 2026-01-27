from sqlalchemy.ext.asyncio import AsyncSession
import openai
from app.core.config import settings
import json
import base64

class BillParserService:
    """
    AI Service to parse bills (PDF/Images) and extract contract data.
    The 'Hunter' eyes.
    """
    
    def __init__(self):
        # Initialize OpenAI client
        # Assumes OPENAI_API_KEY is set in environment variables
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def parse_bill(self, file_content: bytes, file_type: str) -> dict:
        """
        Send file to GPT-4o for parsing.
        Returns a dictionary with extracted data.
        """
        # Encode image to base64
        base64_image = base64.b64encode(file_content).decode('utf-8')
        
        # Determine mime type
        mime_type = "image/jpeg" # Default
        if "pdf" in file_type:
            # Note: GPT-4o Vision currently works best with images. 
            # For PDFs, we ideally convert to image first.
            # For MVP, we assume user uploads images (jpg/png) OR we rely on GPT-4o's file capabilities if using Assistants API.
            # But standard Chat Completion Vision requires images.
            # If PDF, we might need a converter. For now, let's assume image uploads for the vision part
            # or that the frontend converts PDF to image.
            # FALLBACK: If PDF support is strict requirement without converter library, we might need a different approach.
            # Let's proceed assuming we handle Images for Vision primarily in V1 MVP 
            # or that we use a library like pdf2image if needed.
            # For simplicity in V1: Assume Images (screenshots of bills) are primary upload format for Vision.
            pass
        elif "png" in file_type:
            mime_type = "image/png"
            
        prompt = """
        You are an expert data extractor. Analyze this bill/invoice image.
        Extract the following information into a strictly valid JSON object:
        
        - provider: Name of the service provider (e.g. Norlys, YouSee, Telenor).
        - category: One of ["energy", "mobile", "internet"]. Infer from context (kWh = energy, GB = mobile/internet).
        - monthly_price: The monthly cost in DKK. If only total is shown, estimate monthly. Return a number.
        - currency: "DKK".
        - product_name: Name of the subscription plan (e.g. "Fri Data", "Bredbånd 1000").
        - specs: A JSON object with technical details if found (e.g. {"speed_down": 1000, "data_gb": 50}).
        - invoice_date: Date of the bill (YYYY-MM-DD).
        
        If a field is not found, use null.
        Return ONLY the JSON object. No markdown formatting.
        """

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:{mime_type};base64,{base64_image}"
                                }
                            },
                        ],
                    }
                ],
                max_tokens=500,
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            parsed_data = json.loads(content)
            return parsed_data
            
        except Exception as e:
            print(f"Error parsing bill: {e}")
            return None

    async def create_contract_from_bill(self, db: AsyncSession, user_id: str, parsed_data: dict):
        """
        Logic to convert AI data to a Contract in our DB.
        """
        from app.models.contract import Contract
        from app.schemas.contract import ContractCreate
        
        if not parsed_data:
            return None
            
        # Create contract object
        # Map AI fields to DB fields
        from datetime import datetime
        contract_data = Contract(
            user_id=user_id,
            category=parsed_data.get("category", "other"),
            provider=parsed_data.get("provider", "Unknown"),
            name=parsed_data.get("product_name"),
            monthly_price=parsed_data.get("monthly_price"),
            currency=parsed_data.get("currency", "DKK"),
            details=parsed_data.get("specs", {}),
            status="active",  # Assume active if they have a bill
            last_parsed_at=datetime.utcnow()  # ✅ BATCH 1.1: Track when parsed
        )
        
        db.add(contract_data)
        await db.commit()
        await db.refresh(contract_data)
        
        return contract_data




