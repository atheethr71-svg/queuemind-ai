"""
Agent tool definitions for Gemini function calling and autonomous queue operations.
"""
from typing import List, Dict, Any

AGENT_TOOLS: List[Dict[str, Any]] = [
    {
        "name": "get_current_queue_status",
        "description": "Retrieves the current queue length, active counters, and estimated wait time.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "location_id": {
                    "type": "INTEGER",
                    "description": "Optional location id to query"
                }
            }
        }
    },
    {
        "name": "run_counter_simulation",
        "description": "Simulates wait time reduction when changing active counter numbers.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "queue_length": {"type": "INTEGER", "description": "Current people waiting"},
                "current_counters": {"type": "INTEGER", "description": "Current active counters"},
                "proposed_counters": {"type": "INTEGER", "description": "Proposed active counters"},
                "avg_service_time": {"type": "NUMBER", "description": "Average service minutes"}
            },
            "required": ["queue_length", "current_counters", "proposed_counters"]
        }
    },
    {
        "name": "apply_counter_change",
        "description": "Opens or closes service counters upon confirmed administrator intent.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "location_id": {"type": "INTEGER", "description": "Location id"},
                "proposed_counters": {"type": "INTEGER", "description": "New target active counters count"}
            },
            "required": ["location_id", "proposed_counters"]
        }
    }
]
