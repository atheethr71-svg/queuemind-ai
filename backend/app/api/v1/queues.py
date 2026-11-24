"""
Queues API endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.schemas.queue import QueueOut, QueueUpdate, QueueHistoryOut
from app.services.queue_service import QueueService

router = APIRouter(prefix="/queues", tags=["Queues"])


@router.get("", response_model=List[QueueOut])
def list_queues(
    location_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Retrieve all queues, optionally filtered by location."""
    return QueueService.get_queues(db, location_id=location_id)


@router.get("/{queue_id}", response_model=QueueOut)
def get_queue(queue_id: int, db: Session = Depends(get_db)):
    """Retrieve a single queue by id."""
    return QueueService.get_queue(db, queue_id)


@router.patch("/{queue_id}", response_model=QueueOut)
def update_queue(
    queue_id: int,
    data: QueueUpdate,
    db: Session = Depends(get_db)
):
    """Update queue length or status."""
    return QueueService.update_queue(db, queue_id, data, source="manual")


@router.get("/{queue_id}/history", response_model=List[QueueHistoryOut])
def get_queue_history(
    queue_id: int,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get historical records for this queue."""
    return QueueService.get_queue_history(db, queue_id, limit=limit)
