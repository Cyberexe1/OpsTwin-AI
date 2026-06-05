"""
Create the demo user in the database.
Run once after setting up the Neon PostgreSQL connection.

Usage:
    python scripts/seed_demo_user.py
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import settings
from app.db.database import engine, SessionLocal, Base
from app.db.models import User
from app.services.auth import hash_password


def seed():
    # Create tables
    Base.metadata.create_all(bind=engine)
    print(f"Connected to: {settings.database_url[:50]}...")
    print("Tables created.")

    db = SessionLocal()

    # Check if demo user exists
    existing = db.query(User).filter(User.email == "demo@opstwin.ai").first()
    if existing:
        print(f"Demo user already exists (id={existing.id})")
        db.close()
        return

    # Create demo user
    demo_user = User(
        email="demo@opstwin.ai",
        name="Alex Chen",
        role="Senior SRE",
        hashed_password=hash_password("demo1234"),
    )
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)

    print(f"✓ Demo user created:")
    print(f"  Email: demo@opstwin.ai")
    print(f"  Password: demo1234")
    print(f"  Name: Alex Chen")
    print(f"  Role: Senior SRE")
    print(f"  ID: {demo_user.id}")

    db.close()


if __name__ == "__main__":
    seed()
