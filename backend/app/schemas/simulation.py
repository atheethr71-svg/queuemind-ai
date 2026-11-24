"""
Simulation Pydantic schemas.
"""
from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class SimulationRequest(BaseModel):
    location_id: int
    queue_length: int = Field(..., ge=0)
    current_counters: int = Field(..., ge=1)
    proposed_counters: int = Field(..., ge=1)
    avg_service_time_minutes: float = Field(default=5.0, ge=0.5, le=120.0)
    incoming_people: int = Field(default=0, ge=0)
    max_capacity: Optional[int] = Field(None, ge=1)


class SimulationOut(BaseModel):
    id: Optional[int] = None
    location_id: int
    current_counters: int
    proposed_counters: int
    current_wait: float
    predicted_wait: float
    time_saved: float
    utilisation: Optional[float]
    recommendation: Optional[str]
    inputs_json: Optional[Dict[str, Any]]
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
