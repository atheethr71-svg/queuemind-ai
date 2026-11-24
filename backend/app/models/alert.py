"""
Alert SQLAlchemy model.
"""
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    location_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("locations.id"), nullable=False, index=True
    )
    type: Mapped[str] = mapped_column(
        String(100), nullable=False
    )  # queue_overflow, crowd_density, counter_offline, waiting_time_exceeded
    level: Mapped[str] = mapped_column(
        String(20), nullable=False, default="warning"
    )  # info, warning, critical
    message: Mapped[str] = mapped_column(String(1000), nullable=False)
    threshold_value: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    actual_value: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    is_acknowledged: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    acknowledged_by: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    acknowledged_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationships
    location: Mapped["Location"] = relationship("Location", back_populates="alerts")
    acknowledger: Mapped[Optional["User"]] = relationship(
        "User", foreign_keys=[acknowledged_by]
    )

    def __repr__(self) -> str:
        return (
            f"<Alert(id={self.id}, type={self.type!r}, level={self.level!r}, "
            f"acknowledged={self.is_acknowledged})>"
        )
