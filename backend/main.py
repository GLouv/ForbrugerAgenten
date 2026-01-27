"""
Forbrugeragenten Backend API
Main application entry point
"""
import logging
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.v1.router import api_router
from app.core.database import engine, Base

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting Forbrugeragenten API...")
    print(f"📊 Database: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'configured'}")
    print(f"🤖 OpenAI: {'configured' if settings.OPENAI_API_KEY else 'missing'}")
    print(f"🔧 Environment: {'Development' if settings.DEBUG else 'Production'}")
    
    # Security check: DEV_MODE validation
    if settings.DEV_MODE and not settings.DEBUG:
        raise ValueError(
            "🚫 SECURITY ERROR: DEV_MODE cannot be enabled in production (DEBUG=false)\n"
            "Set DEV_MODE=false in your environment variables."
        )
    
    if settings.DEV_MODE and settings.SKIP_AUTH:
        print("⚠️  WARNING: DEVELOPMENT MODE ACTIVE - AUTHENTICATION DISABLED!")
        print(f"👤 Mock user: {settings.DEV_USER_EMAIL}")
        print("🔓 All authentication checks are bypassed")
        print("🚨 This mode should NEVER be used in production!")
    
    # Create tables (in production, use alembic migrations)
    if settings.DEBUG:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    
    yield
    
    # Shutdown
    print("👋 Shutting down Forbrugeragenten API...")
    await engine.dispose()


app = FastAPI(
    title="Forbrugeragenten API",
    description="Intelligent forsikringsplatform med AI-drevet rådgivning",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint - health check"""
    return {
        "message": "Forbrugeragenten API",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected",
        "ai": "ready" if settings.OPENAI_API_KEY else "not configured"
    }


if __name__ == "__main__":
    # Use Railway's PORT if available, otherwise fall back to API_PORT
    port = settings.PORT if settings.PORT is not None else settings.API_PORT
    
    print(f"🚀 Starting server on {settings.API_HOST}:{port}")
    
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=port,
        reload=settings.DEBUG,
        log_level="debug" if settings.DEBUG else "info",
    )
