#!/usr/bin/env python3
"""Seed providers database with Danish service providers"""
import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import async_session_maker
from app.models.provider import Provider


PROVIDERS = [
    # ENERGY
    {
        "name": "Norlys",
        "categories": ["energy"],
        "quote_email": "erhverv@norlys.dk",
        "support_email": "kundeservice@norlys.dk",
        "is_active": True,
        "reputation_score": 75
    },
    {
        "name": "Andel Energi",
        "categories": ["energy"],
        "quote_email": "tilbud@andel.dk",
        "support_email": "support@andel.dk",
        "is_active": True,
        "reputation_score": 70
    },
    {
        "name": "OK",
        "categories": ["energy"],
        "quote_email": "el@ok.dk",
        "support_email": "kundeservice@ok.dk",
        "is_active": True,
        "reputation_score": 65
    },
    {
        "name": "EWII",
        "categories": ["energy"],
        "quote_email": "privat@ewii.com",
        "support_email": "kundeservice@ewii.com",
        "is_active": True,
        "reputation_score": 60
    },
    {
        "name": "Vindstød",
        "categories": ["energy"],
        "quote_email": "kontakt@vindstoed.dk",
        "support_email": "support@vindstoed.dk",
        "is_active": True,
        "reputation_score": 55
    },
    
    # MOBILE
    {
        "name": "TDC",
        "categories": ["mobile", "internet"],
        "quote_email": "erhverv@tdc.dk",
        "support_email": "kundeservice@tdc.dk",
        "is_active": True,
        "reputation_score": 70
    },
    {
        "name": "Telmore",
        "categories": ["mobile"],
        "quote_email": "kontakt@telmore.dk",
        "support_email": "support@telmore.dk",
        "is_active": True,
        "reputation_score": 75
    },
    {
        "name": "Lebara",
        "categories": ["mobile"],
        "quote_email": "info@lebara.dk",
        "support_email": "support@lebara.dk",
        "is_active": True,
        "reputation_score": 60
    },
    {
        "name": "CBB Mobil",
        "categories": ["mobile"],
        "quote_email": "info@cbb.dk",
        "support_email": "support@cbb.dk",
        "is_active": True,
        "reputation_score": 65
    },
    {
        "name": "Oister",
        "categories": ["mobile"],
        "quote_email": "kontakt@oister.dk",
        "support_email": "support@oister.dk",
        "is_active": True,
        "reputation_score": 70
    },
    {
        "name": "3 (Tre)",
        "categories": ["mobile", "internet"],
        "quote_email": "erhverv@3.dk",
        "support_email": "kundeservice@3.dk",
        "is_active": True,
        "reputation_score": 65
    },
    
    # INTERNET
    {
        "name": "YouSee",
        "categories": ["internet", "mobile"],
        "quote_email": "erhverv@yousee.dk",
        "support_email": "kundeservice@yousee.dk",
        "is_active": True,
        "reputation_score": 65
    },
    {
        "name": "Fastspeed",
        "categories": ["internet"],
        "quote_email": "salg@fastspeed.dk",
        "support_email": "support@fastspeed.dk",
        "is_active": True,
        "reputation_score": 80
    },
    {
        "name": "Hiper",
        "categories": ["internet"],
        "quote_email": "kontakt@hiper.dk",
        "support_email": "support@hiper.dk",
        "is_active": True,
        "reputation_score": 75
    },
    {
        "name": "Stofa",
        "categories": ["internet"],
        "quote_email": "erhverv@stofa.dk",
        "support_email": "kundeservice@stofa.dk",
        "is_active": True,
        "reputation_score": 60
    },
    {
        "name": "Waoo",
        "categories": ["internet"],
        "quote_email": "kontakt@waoo.dk",
        "support_email": "support@waoo.dk",
        "is_active": True,
        "reputation_score": 70
    },
]


async def seed_providers():
    """Seed providers to database"""
    async with async_session_maker() as db:
        print("🌱 Seeding providers...")
        
        created = 0
        skipped = 0
        
        for provider_data in PROVIDERS:
            # Check if exists
            result = await db.execute(
                select(Provider).where(Provider.name == provider_data["name"])
            )
            existing = result.scalar_one_or_none()
            
            if existing:
                print(f"  ⏭️  Skipped: {provider_data['name']} (already exists)")
                skipped += 1
                continue
            
            # Create new
            provider = Provider(**provider_data)
            db.add(provider)
            print(f"  ✅ Created: {provider_data['name']}")
            created += 1
        
        await db.commit()
        
        print(f"\n📊 Summary:")
        print(f"   Created: {created}")
        print(f"   Skipped: {skipped}")
        print(f"   Total: {created + skipped}")
        
        # Show counts by category
        energy_count = len([p for p in PROVIDERS if "energy" in p["categories"]])
        mobile_count = len([p for p in PROVIDERS if "mobile" in p["categories"]])
        internet_count = len([p for p in PROVIDERS if "internet" in p["categories"]])
        print(f"\n📂 By category:")
        print(f"   Energy: {energy_count}")
        print(f"   Mobile: {mobile_count}")
        print(f"   Internet: {internet_count}")


if __name__ == "__main__":
    asyncio.run(seed_providers())





