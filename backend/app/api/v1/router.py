"""Main API router for v1 - FORBRUGERAGENT (Energy Focus)"""
from fastapi import APIRouter

from app.api.v1.endpoints import (
    # users,
    # spot_prices,
    waitlist,
    inbox,
    webhooks,
    admin_dashboard,
    auth,
    onboarding,
    database,
    upload,  # ✅ BATCH 2.2: Bill upload endpoint
    # ai_agent,  # TODO: Fix missing agent module
    # notifications,
    # signing,
    # mitid,
)

# DISABLED INSURANCE ENDPOINTS (for V2+)
# from app.api.v1.endpoints import (
#     policies,
#     quotes,
#     properties,
#     vehicles,
#     ai_agent,
#     upload,
#     bidding,
# )

api_router = APIRouter()

# User management
# api_router.include_router(users.router, prefix="/users", tags=["users"])

# AUTHENTICATION
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])

# ONBOARDING
api_router.include_router(onboarding.router, prefix="/onboarding", tags=["onboarding"])

# ENERGY ENDPOINTS (V1)
# api_router.include_router(spot_prices.router, prefix="/spot-prices", tags=["spot-prices"])
api_router.include_router(waitlist.router, prefix="/waitlist", tags=["waitlist"])
api_router.include_router(inbox.router, prefix="/inbox", tags=["inbox"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(admin_dashboard.router, prefix="/admin-dashboard", tags=["admin-dashboard"])
api_router.include_router(database.router, prefix="/database", tags=["database"])

# ✅ BATCH 2.2: Upload & Contracts
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
# api_router.include_router(ai_agent.router, prefix="/ai-agent", tags=["ai-agent"])  # TODO: Fix agents

# Reusable endpoints (TODO: update for energy context)
# api_router.include_router(onboarding.router, prefix="/onboarding", tags=["onboarding"])
# api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
# api_router.include_router(signing.router, tags=["signing"])
# api_router.include_router(mitid.router, prefix="/mitid", tags=["mitid"])

# === DISABLED INSURANCE ENDPOINTS (for V2+) ===
# api_router.include_router(policies.router, prefix="/policies", tags=["policies"])
# api_router.include_router(properties.router, prefix="/properties", tags=["properties"])
# api_router.include_router(vehicles.router, prefix="/vehicles", tags=["vehicles"])
# api_router.include_router(quotes.router, prefix="/quotes", tags=["quotes"])
# api_router.include_router(bidding.router, prefix="/bidding", tags=["bidding"])
# api_router.include_router(ai_agent.router, prefix="/ai-agent", tags=["ai-agent"])
# api_router.include_router(upload.router, prefix="/upload", tags=["upload"])

