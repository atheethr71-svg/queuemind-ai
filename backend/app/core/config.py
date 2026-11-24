"""
Application configuration using Pydantic Settings.
All settings are loaded from environment variables or .env file.
"""
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "QueueMind AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    DEMO_MODE: bool = True

    # Security
    SECRET_KEY: str = "change-this-super-secret-key-in-production-min-32-chars"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Database
    DATABASE_URL: str = "postgresql://queuemind:queuemind@localhost:5432/queuemind"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # AWS
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "ap-south-1"
    AWS_S3_BUCKET: str = "queuemind-uploads"
    AWS_SNS_TOPIC_ARN: Optional[str] = None

    # AI Services
    AI_ENGINE_URL: str = "http://localhost:8001"
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None

    # CORS
    ALLOWED_ORIGINS: List[str] = ["*"]
    ALLOWED_METHODS: List[str] = ["*"]
    ALLOWED_HEADERS: List[str] = ["*"]

    # Queue thresholds for alerts
    QUEUE_ALERT_THRESHOLD: int = 20
    CROWD_DENSITY_ALERT_THRESHOLD: float = 0.75

    # Demo simulation settings
    DEMO_UPDATE_INTERVAL_SECONDS: int = 5
    DEMO_MAX_QUEUE_LENGTH: int = 50
    DEMO_MIN_QUEUE_LENGTH: int = 0

    # File upload
    MAX_UPLOAD_SIZE_MB: int = 10

    # YOLO
    YOLO_MODEL_PATH: str = "yolov8n.pt"

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"


settings = Settings()
