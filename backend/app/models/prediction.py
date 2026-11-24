"""
WaitingTimePrediction SQLAlchemy model.
"""
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class WaitingTimePrediction(Base):
    __tablename__ = "waiting_time_predictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    queue_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("queues.id"), nullable=False, index=True
    )
    predicted_minutes: Mapped[float] = mapped_column(Float, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    model_used: Mapped[str] = mapped_column(
        String(100), nullable=False, default="mm_c_queueing"
    )
    inputs_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # Relationships
    queue: Mapped["Queue"] = relationship("Queue", back_populates="predictions")

    def __repr__(self) -> str:
        return (
            f"<WaitingTimePrediction(id={self.id}, queue_id={self.queue_id}, "
            f"predicted_minutes={self.predicted_minutes:.1f}, confidence={self.confidence:.2f})>"
        )
