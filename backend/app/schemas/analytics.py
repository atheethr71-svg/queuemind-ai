"""
Analytics Pydantic schemas.
"""
from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class AnalyticsOverview(BaseModel):
    total_served_today: int
    avg_waiting_time_minutes: float
    active_counters: int
    total_counters: int
    current_queue_length: int
    alerts_today: int
    peak_hour: Optional[str]
    efficiency_score: float  # 0-100


class HourlyBucket(BaseModel):
    hour: int
    avg_queue_length: float
    total_served: int


class PeakHours(BaseModel):
    location_id: int
    date_range: str
    hourly_data: List[HourlyBucket]
    peak_hour: int
    peak_avg_queue: float


class CounterPerformance(BaseModel):
    counter_id: int
    counter_name: str
    served_today: int
    avg_service_time: float
    status: str
    utilisation_pct: float


class AnalyticsTrends(BaseModel):
    dates: List[str]
    queue_lengths: List[float]
    served_counts: List[int]
    waiting_times: List[float]
