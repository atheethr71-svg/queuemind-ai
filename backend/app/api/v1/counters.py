"""
Counters and Simulation API endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_optional_user
from app.models.user import User
from app.schemas.queue import CounterOut, CounterCreate, CounterUpdate
from app.schemas.simulation import SimulationRequest, SimulationOut
from app.services.counter_service import CounterService

router = APIRouter(prefix="/counters", tags=["Counters"])


@router.get("", response_model=List[CounterOut])
def list_counters(
    location_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """List service counters, optionally filtered by location."""
    return CounterService.get_counters(db, location_id=location_id)


@router.post("", response_model=CounterOut)
def create_counter(
    location_id: int,
    data: CounterCreate,
    db: Session = Depends(get_db)
):
    """Add a new counter to a location."""
    return CounterService.create_counter(db, location_id=location_id, data=data)


@router.patch("/{counter_id}", response_model=CounterOut)
def update_counter(
    counter_id: int,
    data: CounterUpdate,
    db: Session = Depends(get_db)
):
    """Update counter status, operator, or service parameters."""
    return CounterService.update_counter(db, counter_id=counter_id, data=data)


@router.post("/simulate", response_model=SimulationOut)
def simulate_counter_allocation(
    req: SimulationRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Run mathematical counter allocation simulation comparing current vs proposed configurations.
    Returns wait times, time saved, counter utilisation, and recommendations.
    """
    user_id = current_user.id if current_user else None
    return CounterService.simulate_allocation(db, req, user_id=user_id)


@router.post("/apply-recommendation")
def apply_counter_recommendation(
    payload: dict,
    db: Session = Depends(get_db)
):
    """
    Apply simulated recommendation to activate/deactivate counters.
    Expects { "location_id": int, "proposed_counters": int }
    """
    loc_id = payload.get("location_id", 1)
    proposed = payload.get("proposed_counters", 2)
    return CounterService.apply_recommendation(db, location_id=loc_id, proposed_counters=proposed)
