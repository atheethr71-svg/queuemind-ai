"""
Facilities and Locations API endpoints.
"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models.facility import Facility, Location
from app.schemas.facility import FacilityOut, FacilityCreate, LocationOut, LocationCreate

router = APIRouter(prefix="/locations", tags=["Facilities & Locations"])


@router.get("/facilities", response_model=List[FacilityOut])
def list_facilities(db: Session = Depends(get_db)):
    """List all facilities with associated locations."""
    return db.query(Facility).all()


@router.post("/facilities", response_model=FacilityOut)
def create_facility(data: FacilityCreate, db: Session = Depends(get_db)):
    """Register a new facility."""
    fac = Facility(
        name=data.name,
        type=data.type,
        address=data.address,
        admin_id=data.admin_id
    )
    db.add(fac)
    db.commit()
    db.refresh(fac)
    return fac


@router.get("", response_model=List[LocationOut])
def list_locations(db: Session = Depends(get_db)):
    """List all monitored service locations."""
    return db.query(Location).all()


@router.post("", response_model=LocationOut)
def create_location(facility_id: int, data: LocationCreate, db: Session = Depends(get_db)):
    """Add a new queue location to a facility."""
    loc = Location(
        facility_id=facility_id,
        name=data.name,
        type=data.type,
        max_capacity=data.max_capacity
    )
    db.add(loc)
    db.commit()
    db.refresh(loc)
    return loc
