"""Admin endpoints module"""
from fastapi import APIRouter

from app.api.v1.endpoints.admin import auth, dashboard, users, providers, analytics, system, setup

router = APIRouter()

# Auth (no prefix - /admin/login, /admin/me)
router.include_router(auth.router, tags=["admin-auth"])

# Dashboard
router.include_router(dashboard.router, prefix="/dashboard", tags=["admin-dashboard"])

# Users (CRM)
router.include_router(users.router, prefix="/users", tags=["admin-users"])

# Providers
router.include_router(providers.router, prefix="/providers", tags=["admin-providers"])

# Analytics
router.include_router(analytics.router, prefix="/analytics", tags=["admin-analytics"])

# System Health
router.include_router(system.router, prefix="/system", tags=["admin-system"])

# Setup (one-time initialization)
router.include_router(setup.router, prefix="/setup", tags=["admin-setup"])





