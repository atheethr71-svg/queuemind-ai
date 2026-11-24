"""
Trend analyzer for historical queue patterns and congestion forecasting.
"""
from typing import List, Dict, Any


class TrendAnalyzer:
    @staticmethod
    def identify_peak_windows(hourly_averages: Dict[int, float]) -> List[Dict[str, Any]]:
        """Identifies peak congestion hours based on hourly waiting volumes."""
        peaks = []
        for hour, avg_length in hourly_averages.items():
            if avg_length > 20:
                level = "Critical" if avg_length > 35 else "High"
                peaks.append({
                    "hour": hour,
                    "formatted_window": f"{hour:02d}:00 - {(hour+1)%24:02d}:00",
                    "average_queue": avg_length,
                    "congestion_level": level
                })
        return sorted(peaks, key=lambda x: x["average_queue"], reverse=True)
