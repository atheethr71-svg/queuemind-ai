"""
Counter service and dynamic allocation simulation engine.
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.queue import Counter, Queue
from app.models.simulation import SimulationResult
from app.schemas.queue import CounterCreate, CounterUpdate
from app.schemas.simulation import SimulationRequest, SimulationOut


class CounterService:
    @staticmethod
    def get_counters(db: Session, location_id: Optional[int] = None) -> List[Counter]:
        query = db.query(Counter)
        if location_id is not None:
            query = query.filter(Counter.location_id == location_id)
        return query.all()

    @staticmethod
    def get_counter(db: Session, counter_id: int) -> Counter:
        counter = db.query(Counter).filter(Counter.id == counter_id).first()
        if not counter:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Counter with id {counter_id} not found."
            )
        return counter

    @staticmethod
    def create_counter(db: Session, location_id: int, data: CounterCreate) -> Counter:
        counter = Counter(
            location_id=location_id,
            name=data.name,
            status="active",
            avg_service_time=data.avg_service_time,
            served_today=0
        )
        db.add(counter)
        db.commit()
        db.refresh(counter)
        return counter

    @staticmethod
    def update_counter(db: Session, counter_id: int, data: CounterUpdate) -> Counter:
        counter = CounterService.get_counter(db, counter_id)
        if data.name is not None:
            counter.name = data.name
        if data.status is not None:
            counter.status = data.status
        if data.operator_id is not None:
            counter.operator_id = data.operator_id
        if data.avg_service_time is not None:
            counter.avg_service_time = data.avg_service_time
        if data.served_today is not None:
            counter.served_today = data.served_today
            
        counter.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(counter)
        return counter

    @staticmethod
    def simulate_allocation(
        db: Session,
        req: SimulationRequest,
        user_id: Optional[int] = None
    ) -> SimulationOut:
        """
        Mathematical simulation using queueing theory:
        - Service rate per counter = 60 / avg_service_time (people/hr)
        - Total service rate = c * service_rate
        - Current wait time = (queue_length / (current_counters * service_rate_per_min))
        - Proposed wait time = ((queue_length + incoming) / (proposed_counters * service_rate_per_min))
        """
        avg_svc_time = max(0.5, req.avg_service_time_minutes)
        svc_rate_per_min_single = 1.0 / avg_svc_time
        
        current_c = max(1, req.current_counters)
        proposed_c = max(1, req.proposed_counters)
        
        current_service_rate = current_c * svc_rate_per_min_single
        proposed_service_rate = proposed_c * svc_rate_per_min_single
        
        current_wait = round(req.queue_length / current_service_rate, 1) if current_service_rate > 0 else 999.0
        
        total_people = req.queue_length + req.incoming_people
        predicted_wait = round(total_people / proposed_service_rate, 1) if proposed_service_rate > 0 else 999.0
        
        time_saved = round(max(0.0, current_wait - predicted_wait), 1)
        
        # Calculate counter utilisation percentage
        # Utilisation = Arrival Rate / (c * Service Rate)
        arrival_rate = (req.incoming_people / 60.0) if req.incoming_people > 0 else (req.queue_length / max(1.0, current_wait))
        utilisation = round(min(100.0, (arrival_rate / proposed_service_rate) * 100.0), 1) if proposed_service_rate > 0 else 100.0
        
        # Determine recommendation message
        diff = proposed_c - current_c
        if diff > 0:
            rec = f"Opening {diff} additional counter(s) reduces waiting time by {time_saved} minutes ({round((time_saved/max(0.1, current_wait))*100, 1)}% reduction)."
        elif diff < 0:
            rec = f"Closing {abs(diff)} counter(s) will increase waiting time by {abs(time_saved)} minutes with {utilisation}% utilisation."
        else:
            rec = f"Maintaining {current_c} counters results in an estimated waiting time of {predicted_wait} minutes."

        sim_record = SimulationResult(
            user_id=user_id,
            location_id=req.location_id,
            current_counters=current_c,
            proposed_counters=proposed_c,
            current_wait=current_wait,
            predicted_wait=predicted_wait,
            time_saved=time_saved,
            inputs_json={
                "queue_length": req.queue_length,
                "avg_service_time_minutes": req.avg_service_time_minutes,
                "incoming_people": req.incoming_people,
                "utilisation": utilisation,
                "recommendation": rec
            }
        )
        db.add(sim_record)
        db.commit()
        db.refresh(sim_record)

        return SimulationOut(
            id=sim_record.id,
            location_id=req.location_id,
            current_counters=current_c,
            proposed_counters=proposed_c,
            current_wait=current_wait,
            predicted_wait=predicted_wait,
            time_saved=time_saved,
            utilisation=utilisation,
            recommendation=rec,
            inputs_json=sim_record.inputs_json,
            created_at=sim_record.created_at
        )

    @staticmethod
    def apply_recommendation(db: Session, location_id: int, proposed_counters: int) -> Dict[str, Any]:
        """
        Adjusts active/inactive counters for a location to match proposed_counters count.
        """
        counters = db.query(Counter).filter(Counter.location_id == location_id).all()
        if not counters:
            # Create counters if none exist
            for i in range(proposed_counters):
                c = Counter(
                    location_id=location_id,
                    name=f"Counter {i+1}",
                    status="active",
                    avg_service_time=5.0,
                    served_today=0
                )
                db.add(c)
            db.commit()
            return {"status": "success", "message": f"Created and activated {proposed_counters} counters."}
        
        active_count = 0
        for i, c in enumerate(counters):
            if active_count < proposed_counters:
                c.status = "active"
                active_count += 1
            else:
                c.status = "inactive"
            c.updated_at = datetime.utcnow()

        # If more counters needed than exist, create extra
        while active_count < proposed_counters:
            new_c = Counter(
                location_id=location_id,
                name=f"Counter {len(counters) + 1}",
                status="active",
                avg_service_time=5.0,
                served_today=0
            )
            db.add(new_c)
            counters.append(new_c)
            active_count += 1

        db.commit()
        return {
            "status": "success",
            "message": f"Successfully updated counter configuration. {active_count} counter(s) active.",
            "active_counters": active_count,
            "total_counters": len(counters)
        }
