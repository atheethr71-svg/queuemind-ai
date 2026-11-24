"""
Agent API router for AI Engine.
"""
from fastapi import APIRouter
from app.agent.agent import QueueMindAgent, AgentRequest, AgentResponse

router = APIRouter(prefix="/agent", tags=["Agent"])
agent = QueueMindAgent()


@router.post("/chat", response_model=AgentResponse)
def agent_chat(req: AgentRequest):
    return agent.chat(req)
