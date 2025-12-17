"""Database models - FORBRUGERAGENT"""

# User & Auth
from app.models.user import User, MagicLink, Session

# Core Business Models
from app.models.contract import Contract
from app.models.provider import Provider
from app.models.support import SupportTicket, TicketType

# Waitlist (Marketing)
from app.models.waitlist import WaitlistEntry

__all__ = [
    # User & Auth
    "User",
    "MagicLink",
    "Session",
    
    # Core Business
    "Contract",
    "Provider",
    "SupportTicket",
    "TicketType",
    
    # Marketing
    "WaitlistEntry",
]
