"""
Facility and Location SQLAlchemy models.
"""
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Facility(Base):
    __tablename__ = "facilities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g., hospital, canteen, bank
    address: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    admin_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    admin: Mapped[Optional["User"]] = relationship(
        "User", back_populates="managed_facilities", foreign_keys=[admin_id]
    )
    locations: Mapped[list["Location"]] = relationship(
        "Location", back_populates="facility", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Facility(id={self.id}, name={self.name!r}, type={self.type!r})>"


class Location(Base):
    __tablename__ = "locations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    facility_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("facilities.id"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(100), nullable=False)  # counter_zone, waiting_area, etc.
    max_capacity: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    facility: Mapped[Facility] = relationship("Facility", back_populates="locations")
    queues: Mapped[list["Queue"]] = relationship(
        "Queue", back_populates="location", cascade="all, delete-orphan"
    )
    counters: Mapped[list["Counter"]] = relationship(
        "Counter", back_populates="location", cascade="all, delete-orphan"
    )
    detections: Mapped[list["CrowdDetection"]] = relationship(
        "CrowdDetection", back_populates="location"
    )
    alerts: Mapped[list["Alert"]] = relationship(
        "Alert", back_populates="location"
    )
    simulations: Mapped[list["SimulationResult"]] = relationship(
        "SimulationResult", back_populates="location"
    )

    def __repr__(self) -> str:
        return f"<Location(id={self.id}, name={self.name!r}, facility_id={self.facility_id})>"
