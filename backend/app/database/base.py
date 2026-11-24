"""
SQLAlchemy engine, session factory, and declarative base.
Supports PostgreSQL (production/docker) with automatic SQLite fallback for local demo.
"""
import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

logger = logging.getLogger(__name__)

db_url = settings.DATABASE_URL
connect_args = {}

if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        db_url,
        connect_args=connect_args,
        echo=settings.DEBUG,
    )
else:
    try:
        engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
            pool_recycle=3600,
            echo=settings.DEBUG,
        )
        # Test connection
        with engine.connect() as conn:
            pass
    except Exception as e:
        logger.warning(f"Could not connect to PostgreSQL at {db_url} ({e}). Falling back to local SQLite: sqlite:///./queuemind.db")
        db_url = "sqlite:///./queuemind.db"
        connect_args = {"check_same_thread": False}
        engine = create_engine(
            db_url,
            connect_args=connect_args,
            echo=settings.DEBUG,
        )

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


class Base(DeclarativeBase):
    """
    Declarative base class for all SQLAlchemy models.
    All models should inherit from this class.
    """
    pass


def create_tables() -> None:
    """Create all tables in the database. Used for development/demo mode."""
    from app.models import (  # noqa: F401 - imports needed to register models
        User, Role, Facility, Location, Queue, QueueHistory, Counter,
        CrowdDetection, WaitingTimePrediction, Alert,
        AgentConversation, AgentMessage, SimulationResult, AuditLog
    )
    Base.metadata.create_all(bind=engine)
