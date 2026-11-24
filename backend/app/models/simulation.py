"""
SimulationResult SQLAlchemy model.
"""
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class SimulationResult(Base):
    __tablename__ = "simulation_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False, index=True
    )
    location_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("locations.id"), nullable=False, index=True
    )
    current_counters: Mapped[int] = mapped_column(Integer, nullable=False)
    proposed_counters: Mapped[int] = mapped_column(Integer, nullable=False)
    current_wait: Mapped[float] = mapped_column(Float, nullable=False)
    predicted_wait: Mapped[float] = mapped_column(Float, nullable=False)
    time_saved: Mapped[float] = mapped_column(Float, nullable=False)
    utilisation: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    inputs_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    recommendation: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="simulations")
    location: Mapped["Location"] = relationship("Location", back_populates="simulations")

    def __repr__(self) -> str:
        return (
            f"<SimulationResult(id={self.id}, current_wait={self.current_wait:.1f}, "
            f"predicted_wait={self.predicted_wait:.1f}, time_saved={self.time_saved:.1f})>"
        )
