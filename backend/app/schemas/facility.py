"""
Facility and Location Pydantic schemas.
"""
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class LocationCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    type: str = Field(..., min_length=1, max_length=100)
    max_capacity: int = Field(default=100, ge=1, le=10000)


class LocationOut(BaseModel):
    id: int
    facility_id: int
    name: str
    type: str
    max_capacity: int
    created_at: datetime

    model_config = {"from_attributes": True}


class LocationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    type: Optional[str] = Field(None, min_length=1, max_length=100)
    max_capacity: Optional[int] = Field(None, ge=1, le=10000)


class FacilityCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    type: str = Field(..., min_length=1, max_length=100)
    address: Optional[str] = Field(None, max_length=500)
    admin_id: Optional[int] = None
    locations: Optional[List[LocationCreate]] = []


class FacilityOut(BaseModel):
    id: int
    name: str
    type: str
    address: Optional[str]
    admin_id: Optional[int]
    created_at: datetime
    locations: List[LocationOut] = []

    model_config = {"from_attributes": True}


class FacilityUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    type: Optional[str] = Field(None, min_length=1, max_length=100)
    address: Optional[str] = Field(None, max_length=500)
    admin_id: Optional[int] = None
