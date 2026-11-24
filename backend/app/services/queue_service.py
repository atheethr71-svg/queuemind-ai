"""
Queue and queue history service.
"""
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.queue import Queue, QueueHistory
from app.schemas.queue import QueueUpdate


class QueueService:
    @staticmethod
    def get_queues(db: Session, location_id: Optional[int] = None) -> List[Queue]:
        query = db.query(Queue)
        if location_id is not None:
            query = query.filter(Queue.location_id == location_id)
        return query.all()

    @staticmethod
    def get_queue(db: Session, queue_id: int) -> Queue:
        queue = db.query(Queue).filter(Queue.id == queue_id).first()
        if not queue:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Queue with id {queue_id} not found."
            )
        return queue

    @staticmethod
    def get_or_create_queue_for_location(db: Session, location_id: int) -> Queue:
        queue = db.query(Queue).filter(Queue.location_id == location_id).first()
        if not queue:
            queue = Queue(
                location_id=location_id,
                current_length=0,
                status="active"
            )
            db.add(queue)
            db.commit()
            db.refresh(queue)
        return queue

    @staticmethod
    def update_queue(db: Session, queue_id: int, update_data: QueueUpdate, source: str = "manual") -> Queue:
        queue = QueueService.get_queue(db, queue_id)
        
        if update_data.current_length is not None:
            queue.current_length = update_data.current_length
            # Record history entry
            history = QueueHistory(
                queue_id=queue.id,
                length=update_data.current_length,
                timestamp=datetime.utcnow(),
                source=source
            )
            db.add(history)

        if update_data.status is not None:
            queue.status = update_data.status

        queue.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(queue)
        return queue

    @staticmethod
    def get_queue_history(db: Session, queue_id: int, limit: int = 100) -> List[QueueHistory]:
        return db.query(QueueHistory).filter(
            QueueHistory.queue_id == queue_id
        ).order_by(QueueHistory.timestamp.desc()).limit(limit).all()
