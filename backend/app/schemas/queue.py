"""
Queue, QueueHistory, and Counter Pydantic schemas.
"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class QueueOut(BaseModel):
    id: int
    location_id: int
    current_length: int
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class QueueUpdate(BaseModel):
    current_length: Optional[int] = Field(None, ge=0)
    status: Optional[str] = None

    class Config:
        @staticmethod
        def validate_status(v):
            allowed = {"active", "paused", "closed"}
            if v not in allowed:
                raise ValueError(f"Status must be one of: {', '.join(allowed)}")
            return v


class QueueHistoryOut(BaseModel):
    id: int
    queue_id: int
    length: int
    timestamp: datetime
    source: str

    model_config = {"from_attributes": True}


class CounterOut(BaseModel):
    id: int
    location_id: int
    name: str
    status: str
    operator_id: Optional[int]
    avg_service_time: float
    served_today: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CounterCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    avg_service_time: float = Field(default=5.0, ge=0.5, le=120.0)
    operator_id: Optional[int] = None


class CounterUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    status: Optional[str] = None
    operator_id: Optional[int] = None
    avg_service_time: Optional[float] = Field(None, ge=0.5, le=120.0)
    served_today: Optional[int] = Field(None, ge=0)


class CounterStatusToggle(BaseModel):
    status: str  # active, inactive, break
    reason: Optional[str] = None
