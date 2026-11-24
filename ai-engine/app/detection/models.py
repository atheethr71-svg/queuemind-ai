"""
Pydantic models for detection results.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


class DensityLevel(str, Enum):
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"
    CRITICAL = "Critical"


class BoundingBox(BaseModel):
    x1: float = Field(..., description="Left x coordinate (pixel)")
    y1: float = Field(..., description="Top y coordinate (pixel)")
    x2: float = Field(..., description="Right x coordinate (pixel)")
    y2: float = Field(..., description="Bottom y coordinate (pixel)")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Detection confidence score")


class DetectionResult(BaseModel):
    people_count: int = Field(..., ge=0, description="Number of people detected")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Overall detection confidence")
    bounding_boxes: List[BoundingBox] = Field(default_factory=list, description="List of bounding boxes for detected persons")
    density_level: DensityLevel = Field(..., description="Crowd density classification")
    model_used: str = Field(..., description="Name/version of model used for detection")
    is_demo: bool = Field(default=False, description="Whether this result was simulated (demo mode)")
    image_width: Optional[int] = Field(None, description="Width of the processed image in pixels")
    image_height: Optional[int] = Field(None, description="Height of the processed image in pixels")
    processing_time_ms: Optional[float] = Field(None, description="Time taken to process image in milliseconds")
    error: Optional[str] = Field(None, description="Error message if detection failed")

    @staticmethod
    def density_from_count(count: int) -> DensityLevel:
        if count < 5:
            return DensityLevel.LOW
        elif count < 15:
            return DensityLevel.MODERATE
        elif count < 30:
            return DensityLevel.HIGH
        else:
            return DensityLevel.CRITICAL
