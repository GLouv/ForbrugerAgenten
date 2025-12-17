from sqlalchemy import Column, String, DateTime
from datetime import datetime
import uuid
from app.core.database import Base

class WaitlistEntry(Base):
    """
    Model for storing user signups for the app waitlist
    """
    __tablename__ = "waitlist_entries"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=True)  # Optional, but good to have in schema just in case
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<WaitlistEntry {self.name} - {self.phone}>"


