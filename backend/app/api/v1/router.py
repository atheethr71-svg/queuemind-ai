"""
API v1 Router consolidating all sub-modules.
"""
from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.queues import router as queues_router
from app.api.v1.counters import router as counters_router
from app.api.v1.detection import router as detection_router
from app.api.v1.prediction import router as prediction_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.agent import router as agent_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.locations import router as locations_router

api_router = APIRouter(prefix="/v1")

api_router.include_router(auth_router)
api_router.include_router(dashboard_router)
api_router.include_router(queues_router)
api_router.include_router(counters_router)
api_router.include_router(detection_router)
api_router.include_router(prediction_router)
api_router.include_router(alerts_router)
api_router.include_router(agent_router)
api_router.include_router(analytics_router)
api_router.include_router(locations_router)
