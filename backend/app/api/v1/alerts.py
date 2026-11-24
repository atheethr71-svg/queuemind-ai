"""
Alerts API endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_optional_user
from app.models.user import User
from app.schemas.alert import AlertOut, AlertAcknowledge
from app.services.alert_service import AlertService

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("", response_model=List[AlertOut])
def list_alerts(
    location_id: Optional[int] = None,
    unacknowledged_only: bool = False,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Retrieve queue and crowd alerts."""
    return AlertService.get_alerts(
        db,
        location_id=location_id,
        unacknowledged_only=unacknowledged_only,
        limit=limit
    )


@router.patch("/{alert_id}/acknowledge", response_model=AlertOut)
def acknowledge_alert(
    alert_id: int,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """Mark an alert as acknowledged."""
    user_id = current_user.id if current_user else 1
    return AlertService.acknowledge_alert(db, alert_id=alert_id, user_id=user_id)


@router.post("/acknowledge-all")
def acknowledge_all_alerts(
    location_id: Optional[int] = None,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """Acknowledge all pending alerts."""
    user_id = current_user.id if current_user else 1
    count = AlertService.acknowledge_all(db, location_id=location_id, user_id=user_id)
    return {"status": "success", "acknowledged_count": count}
