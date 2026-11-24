"""
YOLOv8-based person detector.
Loads the YOLOv8n model and runs inference to detect people (class 0).
Falls back gracefully when ultralytics is not available.
"""

import io
import time
import logging
from typing import Optional, Tuple

import numpy as np
from PIL import Image, ImageDraw

from app.detection.models import DetectionResult, BoundingBox, DensityLevel

logger = logging.getLogger(__name__)


def _pil_to_numpy(image_bytes: bytes) -> Tuple[np.ndarray, int, int]:
    """Convert raw image bytes to a NumPy array (RGB) and return (arr, width, height)."""
    pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    width, height = pil_img.size
    arr = np.array(pil_img)
    return arr, width, height


class YOLODetector:
    """
    Person detector backed by YOLOv8n.

    On first use the model is loaded from *model_path*. If the model file or
    the ``ultralytics`` package is not available a ``RuntimeError`` is raised
    so the caller can fall back to :class:`~app.detection.demo_detector.DemoDetector`.
    """

    def __init__(self, model_path: str = "yolov8n.pt"):
        self.model_path = model_path
        self._model = None
        self._loaded = False
        self._load_error: Optional[str] = None

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _ensure_loaded(self) -> None:
        if self._loaded:
            return
        try:
            from ultralytics import YOLO  # type: ignore
            logger.info("Loading YOLO model from '%s' …", self.model_path)
            self._model = YOLO(self.model_path)
            self._loaded = True
            logger.info("YOLO model loaded successfully.")
        except ImportError as exc:
            self._load_error = "ultralytics package not installed"
            raise RuntimeError(self._load_error) from exc
        except Exception as exc:
            self._load_error = str(exc)
            raise RuntimeError(f"Failed to load YOLO model: {exc}") from exc

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def detect_people(self, image_bytes: bytes) -> DetectionResult:
        """
        Run person detection on *image_bytes*.

        Parameters
        ----------
        image_bytes:
            Raw bytes of any image format supported by Pillow.

        Returns
        -------
        DetectionResult
            Populated result with count, confidence, bounding boxes and density.
        """
        start = time.perf_counter()

        try:
            self._ensure_loaded()
        except RuntimeError as exc:
            return DetectionResult(
                people_count=0,
                confidence=0.0,
                bounding_boxes=[],
                density_level=DensityLevel.LOW,
                model_used="yolov8n (unavailable)",
                is_demo=False,
                error=str(exc),
            )

        try:
            img_array, width, height = _pil_to_numpy(image_bytes)

            # Run inference – ultralytics returns a list of Results objects
            results = self._model(img_array, classes=[0], verbose=False)  # class 0 = person

            boxes: list[BoundingBox] = []
            confidences: list[float] = []

            for result in results:
                if result.boxes is None:
                    continue
                for box in result.boxes:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    conf = float(box.conf[0])
                    boxes.append(BoundingBox(x1=x1, y1=y1, x2=x2, y2=y2, confidence=conf))
                    confidences.append(conf)

            people_count = len(boxes)
            overall_confidence = float(np.mean(confidences)) if confidences else 0.0
            density = DetectionResult.density_from_count(people_count)
            elapsed_ms = (time.perf_counter() - start) * 1000

            return DetectionResult(
                people_count=people_count,
                confidence=round(overall_confidence, 4),
                bounding_boxes=boxes,
                density_level=density,
                model_used="yolov8n",
                is_demo=False,
                image_width=width,
                image_height=height,
                processing_time_ms=round(elapsed_ms, 2),
            )

        except Exception as exc:
            logger.exception("YOLO inference failed: %s", exc)
            elapsed_ms = (time.perf_counter() - start) * 1000
            return DetectionResult(
                people_count=0,
                confidence=0.0,
                bounding_boxes=[],
                density_level=DensityLevel.LOW,
                model_used="yolov8n",
                is_demo=False,
                processing_time_ms=round(elapsed_ms, 2),
                error=str(exc),
            )

    def draw_boxes(self, image_bytes: bytes, boxes: list[BoundingBox]) -> bytes:
        """
        Draw bounding boxes onto *image_bytes* and return the annotated image as PNG bytes.

        Parameters
        ----------
        image_bytes:
            Original image bytes.
        boxes:
            List of :class:`BoundingBox` objects to draw.

        Returns
        -------
        bytes
            PNG-encoded annotated image.
        """
        pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        draw = ImageDraw.Draw(pil_img)

        for box in boxes:
            # Colour based on confidence: green ≥ 0.7, yellow ≥ 0.5, red < 0.5
            if box.confidence >= 0.7:
                colour = (0, 200, 0)
            elif box.confidence >= 0.5:
                colour = (255, 200, 0)
            else:
                colour = (200, 0, 0)

            draw.rectangle(
                [(box.x1, box.y1), (box.x2, box.y2)],
                outline=colour,
                width=2,
            )
            label = f"{box.confidence:.0%}"
            draw.text((box.x1 + 2, box.y1 + 2), label, fill=colour)

        buf = io.BytesIO()
        pil_img.save(buf, format="PNG")
        return buf.getvalue()
