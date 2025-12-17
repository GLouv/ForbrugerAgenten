"""
Core configuration settings for Forbrugeragent
Loads from environment variables
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""

    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8002  # Railway uses PORT env var, this is fallback for local dev
    PORT: Optional[int] = None  # Railway's dynamic port (takes precedence)
    DEBUG: bool = True
    SECRET_KEY: str = "change-me-in-production-use-openssl-rand-hex-32"

    # Development Mode - Skip authentication for local development
    DEV_MODE: bool = False  # Enable with DEV_MODE=true in .env
    SKIP_AUTH: bool = False  # Skip all authentication checks
    
    # Mock user for development (only used when DEV_MODE=true)
    DEV_USER_EMAIL: str = "dev@forbrugeragent.local"
    DEV_USER_ID: str = "dev-user-123"
    DEV_USER_NAME: str = "Development User"
    DEV_USER_CPR: str = "0101901234"  # Mock CPR for testing
    
    # Project
    PROJECT_NAME: str = "Forbrugeragent"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Database (Railway PostgreSQL)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/forbrugeragent_dev"
    
    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    
    # Auth0
    AUTH0_DOMAIN: str = ""
    AUTH0_CLIENT_ID: str = ""
    AUTH0_CLIENT_SECRET: str = ""
    AUTH0_API_IDENTIFIER: str = ""
    
    # Criipto Verify (MitID)
    CRIIPTO_VERIFY_DOMAIN: str = ""
    CRIIPTO_VERIFY_CLIENT_ID: str = ""
    CRIIPTO_VERIFY_CLIENT_SECRET: str = ""
    CRIIPTO_VERIFY_REDIRECT_URI: str = "http://localhost:5173/mitid/callback"
    
    # Eloverblik API (Danish electricity data)
    ELOVERBLIK_API_URL: str = "https://api.eloverblik.dk/customerapi/api"
    ELOVERBLIK_CLIENT_ID: str = ""
    ELOVERBLIK_CLIENT_SECRET: str = ""
    ELOVERBLIK_REFRESH_TOKEN: str = ""
    ELOVERBLIK_REDIRECT_URI: str = "http://localhost:4411/auth/eloverblik/callback"
    
    # EnergiDataService (Spot prices)
    ENERGI_DATA_SERVICE_URL: str = "https://api.energidataservice.dk/dataset"
    
    # Supabase Storage
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_BUCKET: str = "forbrugeragent-documents"
    
    # Criipto (Additional fields for compatibility)
    CRIIPTO_DOMAIN: str = ""
    CRIIPTO_CLIENT_ID: str = ""
    CRIIPTO_CLIENT_SECRET: str = ""
    
    # SendGrid (Email)
    SENDGRID_API_KEY: str = ""
    SENDGRID_FROM_EMAIL: str = "noreply@forbrugeragent.dk"
    
    # Frontend URL
    FRONTEND_URL: str = "http://localhost:5173"
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:4411",
        "https://forbrugeragent.dk",
        "https://www.forbrugeragent.dk",
        "https://forbrugeragenten.dk",
        "https://www.forbrugeragenten.dk"
    ]
    
    # Dev Mode Settings
    DEV_MODE: bool = False
    SKIP_AUTH: bool = False
    DEV_USER_EMAIL: str = "dev@forbrugeragent.local"
    DEV_USER_ID: str = "dev-user-123"
    DEV_USER_NAME: str = "Development User"
    DEV_USER_CPR: str = "0101901234"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore" # Allow extra fields in .env without error


settings = Settings()
