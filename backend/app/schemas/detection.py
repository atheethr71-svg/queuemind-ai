"""
Detection Pydantic schemas.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class DetectionCreate(BaseModel):
    location_id: int
    people_count: int = Field(..., ge=0)
    density_level: str = Field(default="low")
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    model_used: str = Field(default="yolov8n")
    image_url: Optional[str] = None
    is_demo: bool = False


class DetectionOut(BaseModel):
    id: int
    location_id: int
    image_url: Optional[str]
    people_count: int
    density_level: str
    confidence: float
    model_used: str
    is_demo: bool
    created_at: datetime

    model_config = {"from_attributes": True}
