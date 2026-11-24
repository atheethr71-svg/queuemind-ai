"""
Mathematical waiting-time prediction engine.
Uses an M/M/c queueing model with rush-hour multipliers.
"""

import logging
import math
from typing import Optional

from app.prediction.models import PredictionRequest, PredictionResult, PredictionBreakdown

logger = logging.getLogger(__name__)

# Rush-hour multipliers keyed by (start_hour_inclusive, end_hour_exclusive)
_RUSH_HOUR_MULTIPLIERS: list[tuple[int, int, float]] = [
    (7, 9, 1.3),    # Morning rush
    (12, 14, 1.4),  # Lunch rush
    (17, 19, 1.2),  # Evening rush
]


def _get_time_multiplier(hour: Optional[int]) -> float:
    """Return the rush-hour multiplier for a given hour (0-23), or 1.0 if unknown."""
    if hour is None:
        return 1.0
    for start, end, mult in _RUSH_HOUR_MULTIPLIERS:
        if start <= hour < end:
            return mult
    return 1.0


class WaitingTimePredictor:
    """
    Predicts queue waiting time using the M/M/c (Erlang C) model.

    The simplified formula used here is:

        service_rate = active_counters × (60 / avg_service_time_minutes)   [people/hour]
        base_wait    = (queue_length / service_rate) × 60                   [minutes]
        wait         = base_wait × time_multiplier

    Confidence is estimated heuristically from queue size and counter count.
    """

    def predict(
        self,
        queue_length: int,
        active_counters: int,
        avg_service_time_minutes: float,
        incoming_rate: Optional[float] = None,
        time_of_day: Optional[int] = None,
    ) -> PredictionResult:
        """
        Predict waiting time for the given queue parameters.

        Parameters
        ----------
        queue_length:
            Number of people currently waiting.
        active_counters:
            Number of active service counters.
        avg_service_time_minutes:
            Average service duration per customer (minutes).
        incoming_rate:
            Arrival rate in people/hour (unused in base formula but stored).
        time_of_day:
            Current hour (0-23) used to select the rush-hour multiplier.

        Returns
        -------
        PredictionResult
        """
        # Validate inputs
        if active_counters <= 0:
            return PredictionResult(
                estimated_minutes=0.0,
                confidence=0.0,
                service_rate=0.0,
                formula_used="N/A",
                breakdown=PredictionBreakdown(
                    base_wait_minutes=0.0,
                    time_multiplier=1.0,
                    service_rate_per_hour=0.0,
                    per_counter_rate=0.0,
                    effective_queue_length=queue_length,
                    formula="Error: active_counters must be >= 1",
                ),
                error="active_counters must be at least 1",
            )

        if avg_service_time_minutes <= 0:
            return PredictionResult(
                estimated_minutes=0.0,
                confidence=0.0,
                service_rate=0.0,
                formula_used="N/A",
                breakdown=PredictionBreakdown(
                    base_wait_minutes=0.0,
                    time_multiplier=1.0,
                    service_rate_per_hour=0.0,
                    per_counter_rate=0.0,
                    effective_queue_length=queue_length,
                    formula="Error: avg_service_time_minutes must be > 0",
                ),
                error="avg_service_time_minutes must be greater than 0",
            )

        # Service rate calculation
        per_counter_rate = 60.0 / avg_service_time_minutes  # people/hour per counter
        service_rate = active_counters * per_counter_rate    # total people/hour

        # Base wait (M/M/c simplified)
        if queue_length == 0:
            base_wait = 0.0
        else:
            base_wait = (queue_length / service_rate) * 60.0  # convert hours → minutes

        # Apply rush-hour multiplier
        multiplier = _get_time_multiplier(time_of_day)
        estimated_minutes = base_wait * multiplier

        # Confidence heuristic
        # - Higher queue_length → better statistical estimate (more data)
        # - More active_counters → higher confidence
        confidence = min(
            0.95,
            0.5
            + (1.0 / max(1, queue_length)) * 10.0
            + active_counters * 0.05,
        )
        confidence = round(confidence, 4)

        # Range: ±15 % for uncertainty
        margin = estimated_minutes * 0.15
        range_min = max(0.0, round(estimated_minutes - margin, 2))
        range_max = round(estimated_minutes + margin, 2)

        formula_str = (
            f"M/M/c: service_rate={service_rate:.1f} pph, "
            f"base_wait={base_wait:.2f} min × multiplier={multiplier}"
        )

        breakdown = PredictionBreakdown(
            base_wait_minutes=round(base_wait, 4),
            time_multiplier=multiplier,
            service_rate_per_hour=round(service_rate, 4),
            per_counter_rate=round(per_counter_rate, 4),
            effective_queue_length=queue_length,
            formula=formula_str,
        )

        return PredictionResult(
            estimated_minutes=round(estimated_minutes, 2),
            confidence=confidence,
            service_rate=round(service_rate, 4),
            formula_used="M/M/c (simplified Erlang C)",
            breakdown=breakdown,
            estimated_range_min=range_min,
            estimated_range_max=range_max,
        )
