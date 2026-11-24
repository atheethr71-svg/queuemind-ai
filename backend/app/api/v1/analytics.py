"""
Analytics API endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.schemas.analytics import AnalyticsOverview, PeakHours, CounterPerformance
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview", response_model=AnalyticsOverview)
def get_analytics_overview(
    location_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Consolidated analytics summary."""
    return AnalyticsService.get_overview(db, location_id=location_id)


@router.get("/peak-hours", response_model=PeakHours)
def get_peak_hours(
    location_id: int = 1,
    db: Session = Depends(get_db)
):
    """Hourly queue density and arrival distribution."""
    return AnalyticsService.get_peak_hours(db, location_id=location_id)


@router.get("/counter-performance", response_model=List[CounterPerformance])
def get_counter_performance(
    location_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Performance metrics and utilisation per counter."""
    return AnalyticsService.get_counter_performance(db, location_id=location_id)


@router.get("/export")
def export_analytics_csv(
    location_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Export queue events, counter stats, and alert logs as a downloadable CSV."""
    csv_data = AnalyticsService.export_csv(db, location_id=location_id)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=queuemind_analytics_report.csv"}
    )
