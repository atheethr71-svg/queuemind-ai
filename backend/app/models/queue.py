"""
Queue, QueueHistory, and Counter SQLAlchemy models.
"""
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Queue(Base):
    __tablename__ = "queues"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    location_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("locations.id"), nullable=False, index=True
    )
    current_length: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), default="active", nullable=False
    )  # active, paused, closed
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    location: Mapped["Location"] = relationship("Location", back_populates="queues")
    history: Mapped[list["QueueHistory"]] = relationship(
        "QueueHistory", back_populates="queue", cascade="all, delete-orphan"
    )
    predictions: Mapped[list["WaitingTimePrediction"]] = relationship(
        "WaitingTimePrediction", back_populates="queue"
    )

    def __repr__(self) -> str:
        return f"<Queue(id={self.id}, location_id={self.location_id}, length={self.current_length})>"


class QueueHistory(Base):
    __tablename__ = "queue_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    queue_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("queues.id"), nullable=False, index=True
    )
    length: Mapped[int] = mapped_column(Integer, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    source: Mapped[str] = mapped_column(
        String(50), default="system", nullable=False
    )  # system, manual, demo, detection

    # Relationships
    queue: Mapped[Queue] = relationship("Queue", back_populates="history")

    def __repr__(self) -> str:
        return f"<QueueHistory(id={self.id}, queue_id={self.queue_id}, length={self.length})>"


class Counter(Base):
    __tablename__ = "counters"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    location_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("locations.id"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), default="inactive", nullable=False
    )  # active, inactive, break
    operator_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=True
    )
    avg_service_time: Mapped[float] = mapped_column(
        Float, default=5.0, nullable=False
    )  # in minutes
    served_today: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    location: Mapped["Location"] = relationship("Location", back_populates="counters")
    operator: Mapped[Optional["User"]] = relationship("User", foreign_keys=[operator_id])

    def __repr__(self) -> str:
        return f"<Counter(id={self.id}, name={self.name!r}, status={self.status!r})>"
