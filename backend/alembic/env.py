"""Alembic environment configuration for QueueMind AI.

This file is loaded by Alembic when running migrations. It imports all
SQLAlchemy models so that autogenerate can detect schema changes, and
configures the connection from the DATABASE_URL environment variable.
"""

import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# ---------------------------------------------------------------------------
# Make sure the backend package is on sys.path so model imports resolve.
# When running `alembic upgrade head` from the `backend/` directory the
# package root is already on the path; the guard below handles running from
# the repo root as well.
# ---------------------------------------------------------------------------
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# ---------------------------------------------------------------------------
# Import all models so that Base.metadata is fully populated before Alembic
# inspects it. Add every new model module here as the project grows.
# ---------------------------------------------------------------------------
from app.database.base import Base  # noqa: F401, E402

# User / auth models
from app.models.user import User, Role  # noqa: F401, E402

# Facility / location models
from app.models.facility import Facility, Location  # noqa: F401, E402

# Queue management models
from app.models.queue import Queue, Counter, QueueHistory  # noqa: F401, E402

# AI / detection models
from app.models.detection import CrowdDetection, WaitingTimePrediction  # noqa: F401, E402

# Alert models
from app.models.alert import Alert  # noqa: F401, E402

# Agent / conversation models
from app.models.agent import AgentConversation, AgentMessage  # noqa: F401, E402

# Analytics models
from app.models.analytics import SimulationResult, AuditLog  # noqa: F401, E402

# ---------------------------------------------------------------------------
# Alembic Config object – provides access to values within alembic.ini.
# ---------------------------------------------------------------------------
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Override sqlalchemy.url with the DATABASE_URL env var if set.
database_url = os.environ.get("DATABASE_URL")
if database_url:
    config.set_main_option("sqlalchemy.url", database_url)

# MetaData object for 'autogenerate' support.
target_metadata = Base.metadata


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL and not an Engine, though an
    Engine is acceptable here as well. By skipping the Engine creation we
    don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the script output.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine and associate a connection
    with the context.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
