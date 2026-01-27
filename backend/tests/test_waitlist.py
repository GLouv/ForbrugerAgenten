import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.core.database import Base, get_db
from main import app
import os

# Set test environment variables
os.environ["SENDGRID_API_KEY"] = "test_key_disabled_for_tests"
os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_join_waitlist_success():
    """Test successful waitlist signup"""
    response = client.post(
        "/api/v1/waitlist/",
        json={
            "name": "Test User",
            "phone": "12345678",
            "email": "test@example.com"
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    
    assert data["name"] == "Test User"
    assert data["phone"] == "12345678"
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert "created_at" in data


def test_join_waitlist_duplicate():
    """Test that duplicate phone numbers return existing entry"""
    # First signup
    response1 = client.post(
        "/api/v1/waitlist/",
        json={
            "name": "User One",
            "phone": "99998888",
        }
    )
    assert response1.status_code == 201
    id1 = response1.json()["id"]
    
    # Duplicate signup with same phone
    response2 = client.post(
        "/api/v1/waitlist/",
        json={
            "name": "User Two",
            "phone": "99998888",  # Same phone
        }
    )
    
    # Should return existing entry
    assert response2.status_code == 201  # Still 201 for idempotency
    id2 = response2.json()["id"]
    
    assert id1 == id2  # Same ID means same entry


def test_join_waitlist_missing_fields():
    """Test validation - missing required fields"""
    response = client.post(
        "/api/v1/waitlist/",
        json={
            "name": "Only Name"
            # Missing phone
        }
    )
    
    assert response.status_code == 422  # Validation error


def test_get_waitlist():
    """Test fetching all waitlist entries"""
    # Add some entries
    client.post("/api/v1/waitlist/", json={"name": "User A", "phone": "11111111"})
    client.post("/api/v1/waitlist/", json={"name": "User B", "phone": "22222222"})
    
    # Fetch all
    response = client.get("/api/v1/waitlist/")
    
    assert response.status_code == 200
    data = response.json()
    
    assert isinstance(data, list)
    assert len(data) >= 2  # At least the 2 we added


def test_waitlist_entry_saved_to_db():
    """Test that entry is actually persisted in database"""
    phone = "77777777"
    
    # Create entry
    response = client.post(
        "/api/v1/waitlist/",
        json={"name": "DB Test", "phone": phone}
    )
    
    assert response.status_code == 201
    entry_id = response.json()["id"]
    
    # Fetch all and verify it exists
    response = client.get("/api/v1/waitlist/")
    entries = response.json()
    
    phones = [e["phone"] for e in entries]
    assert phone in phones
