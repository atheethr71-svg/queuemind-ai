"""
Detection API router for AI Engine.
"""
from fastapi import APIRouter, UploadFile, File
from app.detection.detector import YOLODetector
from app.detection.demo_detector import DemoDetector
from app.detection.models import DetectionResult

router = APIRouter(prefix="/detect", tags=["Detection"])
detector = YOLODetector()
demo_detector = DemoDetector()


@router.post("", response_model=DetectionResult)
async def detect(file: UploadFile = File(...)):
    """Run YOLO person detection on uploaded image, falling back to demo simulator if model not local."""
    contents = await file.read()
    try:
        return detector.detect_people(contents)
    except Exception:
        return demo_detector.simulate_detection(contents)
