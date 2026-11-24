"""
Demo service that generates realistic real-time simulated queue data,
updates counters, creates alerts when thresholds breach, and broadcasts via WebSockets.
"""
import random
import asyncio
import logging
from datetime import datetime
from sqlalchemy.orm import Session

from app.database.base import SessionLocal
from app.models.queue import Queue, QueueHistory, Counter
from app.models.facility import Location
from app.models.alert import Alert
from app.core.websocket_manager import manager
from app.services.alert_service import AlertService

logger = logging.getLogger(__name__)


class DemoService:
    @staticmethod
    def generate_step_update(db: Session) -> dict:
        """
        Executes a single realistic simulation step:
        - Slightly adjusts queue lengths (arrivals vs departures)
        - Increments served counts for active counters
        - Triggers alerts if thresholds exceeded
        - Returns state payload for WebSocket broadcasting
        """
        queues = db.query(Queue).all()
        counters = db.query(Counter).all()
        
        updated_queues = []
        for q in queues:
            # Active counters for this location
            active_c = sum(1 for c in counters if c.location_id == q.location_id and c.status == "active")
            
            # Dynamic arrival vs departure simulation
            arrivals = random.choices([0, 1, 2, 3], weights=[0.3, 0.4, 0.2, 0.1])[0]
            departures = random.choices([0, 1, 2], weights=[0.4, 0.4, 0.2])[0] if active_c > 0 else 0
            
            new_length = max(0, min(65, q.current_length + arrivals - departures))
            q.current_length = new_length
            q.updated_at = datetime.utcnow()
            
            # History entry
            history = QueueHistory(
                queue_id=q.id,
                length=new_length,
                timestamp=datetime.utcnow(),
                source="demo_simulation"
            )
            db.add(history)
            
            # Check for threshold alerts
            AlertService.check_and_create_queue_alerts(db, q.location_id, new_length, threshold=22)

            updated_queues.append({
                "queue_id": q.id,
                "location_id": q.location_id,
                "current_length": new_length,
                "active_counters": active_c
            })

        # Randomly increment served count for 1-2 active counters
        active_counters_list = [c for c in counters if c.status == "active"]
        if active_counters_list:
            sampled = random.sample(active_counters_list, min(len(active_counters_list), 2))
            for c in sampled:
                c.served_today += 1
                c.updated_at = datetime.utcnow()

        db.commit()

        total_waiting = sum(q["current_length"] for q in updated_queues)
        total_active_c = sum(1 for c in counters if c.status == "active")
        avg_wait = round((total_waiting / max(1, total_active_c)) * 3.2, 1)

        density = "Low"
        if total_waiting > 35:
            density = "Critical"
        elif total_waiting > 20:
            density = "High"
        elif total_waiting > 10:
            density = "Moderate"

        return {
            "type": "queue_update",
            "timestamp": datetime.utcnow().isoformat(),
            "data": {
                "total_waiting": total_waiting,
                "active_counters": total_active_c,
                "avg_wait_minutes": avg_wait,
                "crowd_density": density,
                "queues": updated_queues
            }
        }

    @staticmethod
    async def run_simulation_loop():
        """
        Background worker that continuously updates the demo simulation
        and broadcasts to connected WebSockets.
        """
        logger.info("Starting QueueMind AI Demo Simulation background loop...")
        while True:
            try:
                await asyncio.sleep(5)
                db = SessionLocal()
                try:
                    payload = DemoService.generate_step_update(db)
                    await manager.broadcast_json(payload)
                finally:
                    db.close()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in demo simulation loop: {e}")
                await asyncio.sleep(5)
