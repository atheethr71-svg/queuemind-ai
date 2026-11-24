"""
CrowdDetection SQLAlchemy model.
"""
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class CrowdDetection(Base):
    __tablename__ = "crowd_detections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    location_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("locations.id"), nullable=False, index=True
    )
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    people_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    density_level: Mapped[str] = mapped_column(
        String(20), nullable=False, default="low"
    )  # low, medium, high, critical
    confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    model_used: Mapped[str] = mapped_column(
        String(100), nullable=False, default="yolov8n"
    )
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # Relationships
    location: Mapped["Location"] = relationship("Location", back_populates="detections")

    def __repr__(self) -> str:
        return (
            f"<CrowdDetection(id={self.id}, location_id={self.location_id}, "
            f"people_count={self.people_count}, density={self.density_level!r})>"
        )
