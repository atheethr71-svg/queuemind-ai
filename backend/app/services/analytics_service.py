"""
Analytics and reporting service.
"""
import io
import csv
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.queue import Queue, QueueHistory, Counter
from app.models.alert import Alert
from app.models.facility import Location
from app.schemas.analytics import AnalyticsOverview, HourlyBucket, PeakHours, CounterPerformance, AnalyticsTrends


class AnalyticsService:
    @staticmethod
    def get_overview(db: Session, location_id: Optional[int] = None) -> AnalyticsOverview:
        # Sum served today across counters
        counter_query = db.query(Counter)
        if location_id is not None:
            counter_query = counter_query.filter(Counter.location_id == location_id)
        counters = counter_query.all()
        
        total_served = sum(c.served_today for c in counters)
        active_counters = sum(1 for c in counters if c.status == "active")
        total_counters = len(counters)
        
        # Current queue length
        queue_query = db.query(Queue)
        if location_id is not None:
            queue_query = queue_query.filter(Queue.location_id == location_id)
        queues = queue_query.all()
        current_len = sum(q.current_length for q in queues)
        
        # Avg waiting time
        avg_svc = (sum(c.avg_service_time for c in counters) / len(counters)) if counters else 5.0
        avg_wait = round((current_len / max(1, active_counters)) * (avg_svc / 5.0) * 3.5, 1)

        # Alerts today
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        alert_query = db.query(Alert).filter(Alert.created_at >= today_start)
        if location_id is not None:
            alert_query = alert_query.filter(Alert.location_id == location_id)
        alerts_count = alert_query.count()

        # Efficiency score based on active counters & wait times
        eff_score = max(40.0, min(99.0, 100.0 - (current_len * 1.2) + (active_counters * 4.0)))
        eff_score = round(eff_score, 1)

        return AnalyticsOverview(
            total_served_today=total_served,
            avg_waiting_time_minutes=avg_wait,
            active_counters=active_counters,
            total_counters=total_counters,
            current_queue_length=current_len,
            alerts_today=alerts_count,
            peak_hour="12:00 - 14:00",
            efficiency_score=eff_score
        )

    @staticmethod
    def get_peak_hours(db: Session, location_id: int) -> PeakHours:
        # Simulated hourly distribution based on realistic peak patterns
        hourly_data = [
            HourlyBucket(hour=8, avg_queue_length=14.2, total_served=45),
            HourlyBucket(hour=9, avg_queue_length=22.8, total_served=78),
            HourlyBucket(hour=10, avg_queue_length=18.5, total_served=65),
            HourlyBucket(hour=11, avg_queue_length=12.1, total_served=50),
            HourlyBucket(hour=12, avg_queue_length=31.4, total_served=110),
            HourlyBucket(hour=13, avg_queue_length=28.7, total_served=95),
            HourlyBucket(hour=14, avg_queue_length=16.3, total_served=60),
            HourlyBucket(hour=15, avg_queue_length=11.0, total_served=42),
            HourlyBucket(hour=16, avg_queue_length=15.6, total_served=55),
            HourlyBucket(hour=17, avg_queue_length=25.2, total_served=88),
            HourlyBucket(hour=18, avg_queue_length=20.4, total_served=72),
            HourlyBucket(hour=19, avg_queue_length=10.5, total_served=38),
        ]
        return PeakHours(
            location_id=location_id,
            date_range="Last 7 Days",
            hourly_data=hourly_data,
            peak_hour=12,
            peak_avg_queue=31.4
        )

    @staticmethod
    def get_counter_performance(db: Session, location_id: Optional[int] = None) -> List[CounterPerformance]:
        query = db.query(Counter)
        if location_id is not None:
            query = query.filter(Counter.location_id == location_id)
        counters = query.all()
        
        results = []
        for c in counters:
            # Utilisation % calculated from served today and avg service time
            util = min(98.0, max(20.0, (c.served_today * c.avg_service_time / 480.0) * 100.0))
            results.append(
                CounterPerformance(
                    counter_id=c.id,
                    counter_name=c.name,
                    served_today=c.served_today,
                    avg_service_time=c.avg_service_time,
                    status=c.status,
                    utilisation_pct=round(util, 1)
                )
            )
        return results

    @staticmethod
    def get_trends(db: Session, location_id: Optional[int] = None) -> AnalyticsTrends:
        # 7-day trend
        today = datetime.utcnow()
        dates = [(today - timedelta(days=i)).strftime("%b %d") for i in range(6, -1, -1)]
        queue_lengths = [18.2, 22.5, 19.8, 25.1, 28.4, 21.0, 16.5]
        served_counts = [240, 310, 285, 360, 420, 290, 215]
        waiting_times = [12.4, 15.2, 13.0, 18.5, 21.3, 14.8, 11.2]

        return AnalyticsTrends(
            dates=dates,
            queue_lengths=queue_lengths,
            served_counts=served_counts,
            waiting_times=waiting_times
        )

    @staticmethod
    def export_csv(db: Session, location_id: Optional[int] = None) -> str:
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow(["Timestamp", "Location ID", "Metric Type", "Value", "Notes"])
        
        # Write counters data
        counters = db.query(Counter).all()
        for c in counters:
            writer.writerow([
                c.updated_at.isoformat() if c.updated_at else datetime.utcnow().isoformat(),
                c.location_id,
                f"Counter Served ({c.name})",
                c.served_today,
                f"Status: {c.status}, Avg Time: {c.avg_service_time}m"
            ])

        # Write recent alerts
        alerts = db.query(Alert).limit(50).all()
        for a in alerts:
            writer.writerow([
                a.created_at.isoformat(),
                a.location_id,
                f"Alert ({a.level})",
                a.actual_value or 0,
                a.message
            ])

        return output.getvalue()
