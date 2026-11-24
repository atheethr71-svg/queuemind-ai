"""
Prediction Pydantic schemas.
"""
from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    queue_id: int
    queue_length: Optional[int] = Field(None, ge=0)
    active_counters: Optional[int] = Field(None, ge=0)
    avg_service_time_minutes: Optional[float] = Field(None, ge=0.1)
    arrival_rate_per_minute: Optional[float] = Field(None, ge=0.0)


class PredictionOut(BaseModel):
    id: int
    queue_id: int
    predicted_minutes: float
    confidence: float
    model_used: str
    inputs_json: Optional[Dict[str, Any]]
    created_at: datetime

    model_config = {"from_attributes": True}


class PredictionSummary(BaseModel):
    queue_id: int
    predicted_minutes: float
    confidence: float
    breakdown: Dict[str, Any]
    recommendation: str
