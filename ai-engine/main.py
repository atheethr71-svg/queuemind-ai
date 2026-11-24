"""
QueueMind AI - AI Engine Service Entrypoint (Port 8001).
Provides YOLO Crowd Detection, Waiting Time Prediction, and AI Operations Agent inference.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.detection import router as detection_router
from app.api.prediction import router as prediction_router
from app.api.agent import router as agent_router

app = FastAPI(
    title="QueueMind AI - AI Engine",
    version="1.0.0",
    description="Inference service for YOLO Person Detection, Queue Time Prediction, and AI Agent"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detection_router)
app.include_router(prediction_router)
app.include_router(agent_router)


@app.get("/health")
def health():
    return {"status": "healthy", "service": "ai-engine"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=False)
