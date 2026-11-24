"""
QueueMind AI - Backend Main Application Entrypoint.
Production-grade FastAPI application with WebSockets, dynamic demo generation,
and REST APIs.
"""
import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.websocket_manager import manager
from app.database.base import create_tables, SessionLocal
from app.api.v1.router import api_router
from app.services.demo_service import DemoService
from scripts.seed_data import seed_database
from app.models.user import User

logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("queuemind-backend")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist and seed demo data if empty
    logger.info("Initializing QueueMind AI Database...")
    create_tables()
    
    # Auto-seed if users table is empty
    db = SessionLocal()
    try:
        user_count = db.query(User).count()
        if user_count == 0:
            logger.info("Database is empty. Seeding initial demo and administrative data...")
            seed_database(db)
            logger.info("Database seeding complete.")
    except Exception as e:
        logger.warning(f"Database check/seed note: {e}")
    finally:
        db.close()

    # Launch background simulation task in demo mode
    demo_task = None
    if settings.DEMO_MODE:
        demo_task = asyncio.create_task(DemoService.run_simulation_loop())

    yield

    # Shutdown
    if demo_task:
        demo_task.cancel()
        try:
            await demo_task
        except asyncio.CancelledError:
            pass
    logger.info("QueueMind AI Backend shutdown cleanly.")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Smart Queue Monitoring & Predictive Management System Backend API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=settings.ALLOWED_METHODS,
    allow_headers=settings.ALLOWED_HEADERS,
)

# API Routers
app.include_router(api_router, prefix="/api")


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "demo_mode": settings.DEMO_MODE
    }


@app.websocket("/ws/queues")
async def websocket_queue_endpoint(
    websocket: WebSocket,
    token: str = Query(None)
):
    """
    WebSocket endpoint for real-time queue length, density,
    waiting time, and alert updates.
    """
    await manager.connect(websocket)
    try:
        # Send initial snapshot upon connection
        db = SessionLocal()
        try:
            initial_state = DemoService.generate_step_update(db)
            await websocket.send_json(initial_state)
        finally:
            db.close()

        while True:
            # Keep connection alive & listen for client pings
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=settings.DEBUG)
