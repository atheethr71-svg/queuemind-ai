"""
Context builder for AI Operations Agent.
"""
from typing import Dict, Any


def format_operational_context(context_data: Dict[str, Any]) -> str:
    """Formats raw system state into a structured context string for LLM."""
    total_waiting = context_data.get("total_waiting", 0)
    active_c = context_data.get("active_counters", 1)
    avg_wait = context_data.get("avg_wait_minutes", 0.0)
    alerts = context_data.get("alerts", [])
    
    alert_summary = f"{len(alerts)} active alerts" if alerts else "No active alerts"
    return (
        f"[CURRENT QUEUE OPERATIONAL STATE]\n"
        f"- Total People Waiting: {total_waiting}\n"
        f"- Active Counters: {active_c}\n"
        f"- Average Waiting Time: {avg_wait} minutes\n"
        f"- Alerts: {alert_summary}\n"
    )
