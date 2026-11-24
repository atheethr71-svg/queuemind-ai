"""
Alert Pydantic schemas.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class AlertOut(BaseModel):
    id: int
    location_id: int
    type: str
    level: str
    message: str
    threshold_value: Optional[float]
    actual_value: Optional[float]
    is_acknowledged: bool
    acknowledged_by: Optional[int]
    created_at: datetime
    acknowledged_at: Optional[datetime]

    model_config = {"from_attributes": True}


class AlertAcknowledge(BaseModel):
    note: Optional[str] = Field(None, max_length=500)


class AlertCreate(BaseModel):
    location_id: int
    type: str
    level: str = Field(default="warning")
    message: str = Field(..., max_length=1000)
    threshold_value: Optional[float] = None
    actual_value: Optional[float] = None
