"""
Waiting Time Prediction API endpoints.
"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.schemas.prediction import PredictionRequest, PredictionOut, PredictionSummary
from app.services.prediction_service import PredictionService

router = APIRouter(prefix="/predictions", tags=["Predictions"])


@router.post("/waiting-time", response_model=PredictionSummary)
def predict_waiting_time(
    req: PredictionRequest,
    db: Session = Depends(get_db)
):
    """
    Calculate dynamic waiting time based on queue length, counter availability,
    and service rate parameters.
    """
    return PredictionService.predict_for_queue(db, req)


@router.get("/history", response_model=List[PredictionOut])
def get_prediction_history(
    queue_id: int,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Retrieve historical predictions for a queue."""
    return PredictionService.get_prediction_history(db, queue_id, limit=limit)
