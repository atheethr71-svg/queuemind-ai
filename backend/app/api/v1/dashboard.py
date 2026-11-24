"""
Dashboard API endpoints for real-time overview and trends.
"""
from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/overview")
def get_dashboard_overview(
    location_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get consolidated dashboard metrics:
    - total waiting
    - active & total counters
    - avg wait time
    - efficiency score
    - alerts count
    - peak hour
    """
    return AnalyticsService.get_overview(db, location_id=location_id)


@router.get("/trends")
def get_dashboard_trends(
    location_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get time-series trends for queue length, wait times, and people served."""
    return AnalyticsService.get_trends(db, location_id=location_id)
