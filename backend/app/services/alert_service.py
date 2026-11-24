"""
Alert management and threshold evaluation service with AWS SNS integration.
"""
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.alert import Alert
from app.schemas.alert import AlertCreate
from app.core.aws_client import aws_client


class AlertService:
    @staticmethod
    def get_alerts(
        db: Session,
        location_id: Optional[int] = None,
        unacknowledged_only: bool = False,
        limit: int = 100
    ) -> List[Alert]:
        query = db.query(Alert)
        if location_id is not None:
            query = query.filter(Alert.location_id == location_id)
        if unacknowledged_only:
            query = query.filter(Alert.is_acknowledged == False)
        return query.order_by(Alert.created_at.desc()).limit(limit).all()

    @staticmethod
    def create_alert(db: Session, data: AlertCreate) -> Alert:
        alert = Alert(
            location_id=data.location_id,
            type=data.type,
            level=data.level,
            message=data.message,
            threshold_value=data.threshold_value,
            actual_value=data.actual_value,
            is_acknowledged=False,
            created_at=datetime.utcnow()
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)

        # Trigger AWS SNS notification if critical or warning
        if data.level in ["critical", "warning"]:
            subject = f"QueueMind Alert [{data.level.upper()}]: Location {data.location_id}"
            aws_client.send_sns_notification(
                subject=subject,
                message=f"{data.message} (Actual: {data.actual_value}, Threshold: {data.threshold_value})"
            )

        return alert

    @staticmethod
    def acknowledge_alert(db: Session, alert_id: int, user_id: int) -> Alert:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if not alert:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Alert with id {alert_id} not found."
            )
        alert.is_acknowledged = True
        alert.acknowledged_by = user_id
        alert.acknowledged_at = datetime.utcnow()
        db.commit()
        db.refresh(alert)
        return alert

    @staticmethod
    def acknowledge_all(db: Session, location_id: Optional[int] = None, user_id: Optional[int] = None) -> int:
        query = db.query(Alert).filter(Alert.is_acknowledged == False)
        if location_id is not None:
            query = query.filter(Alert.location_id == location_id)
        
        alerts = query.all()
        now = datetime.utcnow()
        for a in alerts:
            a.is_acknowledged = True
            a.acknowledged_by = user_id
            a.acknowledged_at = now
        
        db.commit()
        return len(alerts)

    @staticmethod
    def check_and_create_queue_alerts(db: Session, location_id: int, queue_length: int, threshold: int = 20) -> Optional[Alert]:
        if queue_length >= threshold:
            level = "critical" if queue_length >= threshold * 1.5 else "warning"
            # Avoid duplicate unacknowledged alert for same condition in last 10 minutes
            recent = db.query(Alert).filter(
                Alert.location_id == location_id,
                Alert.type == "queue_length_exceeded",
                Alert.is_acknowledged == False
            ).first()
            if not recent:
                return AlertService.create_alert(
                    db,
                    AlertCreate(
                        location_id=location_id,
                        type="queue_length_exceeded",
                        level=level,
                        message=f"Queue length reached {queue_length} people (Threshold: {threshold}). Consider adding counters.",
                        threshold_value=float(threshold),
                        actual_value=float(queue_length)
                    )
                )
        return None
