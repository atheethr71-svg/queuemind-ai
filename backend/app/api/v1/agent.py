"""
AI Browser Operations Agent API endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_optional_user
from app.models.user import User
from app.schemas.agent import ChatRequest, ChatResponse, MessageOut
from app.services.agent_service import AgentService

router = APIRouter(prefix="/agent", tags=["AI Operations Agent"])


@router.post("/chat", response_model=ChatResponse)
def agent_chat(
    req: ChatRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Interact with the QueueMind AI Operations Agent.
    Executes tool calling, queries current queue metrics, recommends operational actions,
    and executes counter adjustments upon confirmation.
    """
    user_id = current_user.id if current_user else 1
    return AgentService.process_agent_query(db, user_id=user_id, req=req)


@router.get("/history", response_model=List[MessageOut])
def get_agent_history(
    conversation_id: int,
    db: Session = Depends(get_db)
):
    """Retrieve chat message history for a conversation."""
    return AgentService.get_conversation_history(db, conversation_id=conversation_id)
