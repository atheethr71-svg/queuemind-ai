"""
Pydantic models for waiting-time prediction results.
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from enum import Enum


class PredictionRequest(BaseModel):
    queue_length: int = Field(..., ge=0, description="Number of people currently in the queue")
    active_counters: int = Field(..., ge=1, description="Number of currently active service counters")
    avg_service_time_minutes: float = Field(..., gt=0, description="Average time (minutes) to serve one person")
    incoming_rate: Optional[float] = Field(None, ge=0, description="Incoming people per hour (optional)")
    time_of_day: Optional[int] = Field(None, ge=0, le=23, description="Hour of day 0-23 for rush-hour multiplier")
    location_id: Optional[str] = Field(None, description="Location identifier for context")


class PredictionBreakdown(BaseModel):
    base_wait_minutes: float = Field(..., description="Raw wait before multipliers")
    time_multiplier: float = Field(..., description="Rush-hour multiplier applied")
    service_rate_per_hour: float = Field(..., description="People served per hour across all counters")
    per_counter_rate: float = Field(..., description="People served per hour per counter")
    effective_queue_length: int = Field(..., description="Queue length used in calculation")
    formula: str = Field(..., description="Mathematical formula applied")


class PredictionResult(BaseModel):
    estimated_minutes: float = Field(..., ge=0, description="Predicted waiting time in minutes")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score of this prediction")
    service_rate: float = Field(..., description="Effective service rate (people/hour)")
    formula_used: str = Field(..., description="Formula or model used for prediction")
    breakdown: PredictionBreakdown = Field(..., description="Detailed breakdown of the calculation")
    error: Optional[str] = Field(None, description="Error message if prediction failed")

    # Convenience display helpers
    estimated_range_min: Optional[float] = Field(None, description="Lower bound estimate (minutes)")
    estimated_range_max: Optional[float] = Field(None, description="Upper bound estimate (minutes)")
