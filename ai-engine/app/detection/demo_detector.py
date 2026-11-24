"""
Demo detector that simulates realistic crowd detections without a real model.
Useful for development, testing, and demo environments where YOLO is not available.
"""

import io
import math
import random
import time
from typing import Optional

import numpy as np
from PIL import Image

from app.detection.models import DetectionResult, BoundingBox, DensityLevel


class DemoDetector:
    """
    Simulated person detector for demo / development mode.

    ``simulate_detection`` generates a plausible :class:`DetectionResult`
    without running any real inference, using controlled randomness so that
    consecutive calls look smooth and realistic.
    """

    # Typical image dimensions used when no image is provided
    DEFAULT_WIDTH = 640
    DEFAULT_HEIGHT = 480

    # Person bounding-box dimensions as fractions of image size
    BOX_WIDTH_FRACTION = 0.07
    BOX_HEIGHT_FRACTION = 0.25

    def simulate_detection(
        self,
        image_bytes: Optional[bytes] = None,
        seed: Optional[int] = None,
    ) -> DetectionResult:
        """
        Generate a simulated :class:`DetectionResult`.

        Parameters
        ----------
        image_bytes:
            Optional raw image bytes.  When provided the actual image dimensions
            are used for bounding-box placement; otherwise defaults are used.
        seed:
            Optional random seed for reproducibility in tests.

        Returns
        -------
        DetectionResult
            Simulated result with ``is_demo=True`` and ``model_used="demo"``.
        """
        start = time.perf_counter()

        rng = random.Random(seed) if seed is not None else random.Random()

        # Determine image dimensions
        width, height = self.DEFAULT_WIDTH, self.DEFAULT_HEIGHT
        if image_bytes:
            try:
                pil_img = Image.open(io.BytesIO(image_bytes))
                width, height = pil_img.size
            except Exception:
                pass  # fall back to defaults

        # Generate people count: base 3-45, with Gaussian noise for realism
        base_count = rng.randint(3, 45)
        noise = int(rng.gauss(0, 2))  # ±2 people Gaussian noise
        people_count = max(0, base_count + noise)

        # Generate plausible bounding boxes
        boxes = self._generate_boxes(people_count, width, height, rng)

        # Overall confidence: realistic range 0.72-0.95
        confidence = round(rng.uniform(0.72, 0.95), 4)

        # Processing time simulation: 20-120 ms
        simulated_ms = rng.uniform(20.0, 120.0)
        elapsed_ms = (time.perf_counter() - start) * 1000 + simulated_ms

        density = DetectionResult.density_from_count(people_count)

        return DetectionResult(
            people_count=people_count,
            confidence=confidence,
            bounding_boxes=boxes,
            density_level=density,
            model_used="demo",
            is_demo=True,
            image_width=width,
            image_height=height,
            processing_time_ms=round(elapsed_ms, 2),
        )

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _generate_boxes(
        self,
        count: int,
        img_width: int,
        img_height: int,
        rng: random.Random,
    ) -> list[BoundingBox]:
        """
        Place *count* non-overlapping bounding boxes across the image.

        Boxes are arranged in a loose grid with jitter so that they look
        like real detections on a crowd scene.
        """
        if count == 0:
            return []

        boxes: list[BoundingBox] = []

        box_w = img_width * self.BOX_WIDTH_FRACTION
        box_h = img_height * self.BOX_HEIGHT_FRACTION

        # Determine grid layout
        cols = max(1, math.ceil(math.sqrt(count * (img_width / img_height))))
        rows = max(1, math.ceil(count / cols))

        cell_w = img_width / cols
        cell_h = img_height / rows

        for i in range(count):
            col = i % cols
            row = i // cols

            # Cell centre with jitter
            cx = cell_w * col + cell_w / 2 + rng.uniform(-cell_w * 0.2, cell_w * 0.2)
            cy = cell_h * row + cell_h / 2 + rng.uniform(-cell_h * 0.2, cell_h * 0.2)

            # Add slight size variation
            w = box_w * rng.uniform(0.8, 1.2)
            h = box_h * rng.uniform(0.8, 1.2)

            x1 = max(0.0, cx - w / 2)
            y1 = max(0.0, cy - h / 2)
            x2 = min(float(img_width), cx + w / 2)
            y2 = min(float(img_height), cy + h / 2)

            conf = round(rng.uniform(0.65, 0.98), 4)

            boxes.append(BoundingBox(x1=x1, y1=y1, x2=x2, y2=y2, confidence=conf))

        return boxes
