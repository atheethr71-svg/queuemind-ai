"""
Core configuration for QueueMind AI Engine.
Reads settings from environment variables / .env file.
"""

from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    # Service
    SERVICE_NAME: str = "QueueMind AI Engine"
    VERSION: str = "1.0.0"
    PORT: int = 8001
    HOST: str = "0.0.0.0"
    DEBUG: bool = False

    # YOLO
    YOLO_MODEL_PATH: str = "yolov8n.pt"
    DEMO_MODE: bool = True

    # Gemini / OpenAI
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None

    # Backend
    BACKEND_URL: str = "http://localhost:8000"

    # CORS
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:8000", "*"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
