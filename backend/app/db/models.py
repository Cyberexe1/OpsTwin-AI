from sqlalchemy import Column, String, Float, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="Engineer")
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    service = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    symptoms = Column(JSON, default=[])
    status = Column(String, default="completed")
    overall_confidence = Column(Float, default=0.0)
    resolution_plan = Column(JSON, default={})
    agent_outputs = Column(JSON, default={})
    duration_seconds = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
