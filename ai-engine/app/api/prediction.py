"""
Prediction API router for AI Engine.
"""
from fastapi import APIRouter
from app.prediction.waiting_time import WaitingTimePredictor
from app.prediction.models import PredictionRequest, PredictionResult

router = APIRouter(prefix="/predict", tags=["Prediction"])
predictor = WaitingTimePredictor()


@router.post("", response_model=PredictionResult)
def predict(req: PredictionRequest):
    """Predict queue waiting time and confidence score using M/M/c queueing theory."""
    return predictor.predict(
        queue_length=req.queue_length,
        active_counters=req.active_counters,
        avg_service_time_minutes=req.avg_service_time_minutes,
        incoming_rate=req.incoming_rate,
        time_of_day=req.time_of_day
    )
