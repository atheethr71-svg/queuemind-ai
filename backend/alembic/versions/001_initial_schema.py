"""001_initial_schema

Revision ID: 001
Revises: 
Create Date: 2024-01-01 00:00:00.000000

Initial database schema for QueueMind AI platform.
Creates all tables required by the application.
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ------------------------------------------------------------------
    # roles table
    # ------------------------------------------------------------------
    op.create_table(
        "roles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=50), nullable=False),
        sa.Column(
            "permissions",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
            server_default="{}",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.create_index(op.f("ix_roles_id"), "roles", ["id"], unique=False)
    op.create_index(op.f("ix_roles_name"), "roles", ["name"], unique=True)

    # ------------------------------------------------------------------
    # users table
    # ------------------------------------------------------------------
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=True),
        sa.Column("role", sa.String(length=50), nullable=True, server_default="operator"),
        sa.Column("is_active", sa.Boolean(), nullable=True, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            onupdate=sa.text("now()"),
            nullable=True,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)

    # ------------------------------------------------------------------
    # facilities table
    # ------------------------------------------------------------------
    op.create_table(
        "facilities",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("type", sa.String(length=100), nullable=True),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("admin_id", sa.Integer(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["admin_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_facilities_id"), "facilities", ["id"], unique=False)
    op.create_index(op.f("ix_facilities_name"), "facilities", ["name"], unique=False)

    # ------------------------------------------------------------------
    # locations table
    # ------------------------------------------------------------------
    op.create_table(
        "locations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("facility_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("type", sa.String(length=100), nullable=True),
        sa.Column("max_capacity", sa.Integer(), nullable=True, server_default="100"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["facility_id"], ["facilities.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_locations_id"), "locations", ["id"], unique=False)
    op.create_index(
        op.f("ix_locations_facility_id"), "locations", ["facility_id"], unique=False
    )

    # ------------------------------------------------------------------
    # queues table
    # ------------------------------------------------------------------
    op.create_table(
        "queues",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("location_id", sa.Integer(), nullable=False),
        sa.Column("current_length", sa.Integer(), nullable=True, server_default="0"),
        sa.Column(
            "status",
            sa.String(length=50),
            nullable=True,
            server_default="active",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["location_id"], ["locations.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_queues_id"), "queues", ["id"], unique=False)
    op.create_index(
        op.f("ix_queues_location_id"), "queues", ["location_id"], unique=False
    )

    # ------------------------------------------------------------------
    # counters table
    # ------------------------------------------------------------------
    op.create_table(
        "counters",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("location_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column(
            "status",
            sa.String(length=50),
            nullable=True,
            server_default="inactive",
        ),
        sa.Column("operator_id", sa.Integer(), nullable=True),
        sa.Column(
            "avg_service_time",
            sa.Float(),
            nullable=True,
            server_default="5.0",
            comment="Average service time in minutes",
        ),
        sa.Column("served_today", sa.Integer(), nullable=True, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["location_id"], ["locations.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["operator_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_counters_id"), "counters", ["id"], unique=False)
    op.create_index(
        op.f("ix_counters_location_id"), "counters", ["location_id"], unique=False
    )

    # ------------------------------------------------------------------
    # crowd_detections table
    # ------------------------------------------------------------------
    op.create_table(
        "crowd_detections",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("location_id", sa.Integer(), nullable=True),
        sa.Column("image_url", sa.Text(), nullable=True),
        sa.Column("people_count", sa.Integer(), nullable=True, server_default="0"),
        sa.Column(
            "density_level",
            sa.String(length=50),
            nullable=True,
            comment="low | medium | high | critical",
        ),
        sa.Column("confidence", sa.Float(), nullable=True),
        sa.Column("model_used", sa.String(length=100), nullable=True),
        sa.Column("is_demo", sa.Boolean(), nullable=True, server_default="false"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["location_id"], ["locations.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_crowd_detections_id"), "crowd_detections", ["id"], unique=False
    )
    op.create_index(
        op.f("ix_crowd_detections_location_id"),
        "crowd_detections",
        ["location_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_crowd_detections_created_at"),
        "crowd_detections",
        ["created_at"],
        unique=False,
    )

    # ------------------------------------------------------------------
    # waiting_time_predictions table
    # ------------------------------------------------------------------
    op.create_table(
        "waiting_time_predictions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("queue_id", sa.Integer(), nullable=True),
        sa.Column("predicted_minutes", sa.Float(), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=True),
        sa.Column("model_used", sa.String(length=100), nullable=True),
        sa.Column(
            "inputs_json",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
            server_default="{}",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["queue_id"], ["queues.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_waiting_time_predictions_id"),
        "waiting_time_predictions",
        ["id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_waiting_time_predictions_queue_id"),
        "waiting_time_predictions",
        ["queue_id"],
        unique=False,
    )

    # ------------------------------------------------------------------
    # queue_history table
    # ------------------------------------------------------------------
    op.create_table(
        "queue_history",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("queue_id", sa.Integer(), nullable=False),
        sa.Column("length", sa.Integer(), nullable=False),
        sa.Column(
            "timestamp",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "source",
            sa.String(length=50),
            nullable=True,
            server_default="system",
            comment="system | manual | demo",
        ),
        sa.ForeignKeyConstraint(["queue_id"], ["queues.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_queue_history_id"), "queue_history", ["id"], unique=False)
    op.create_index(
        op.f("ix_queue_history_queue_id"), "queue_history", ["queue_id"], unique=False
    )
    op.create_index(
        op.f("ix_queue_history_timestamp"),
        "queue_history",
        ["timestamp"],
        unique=False,
    )

    # ------------------------------------------------------------------
    # alerts table
    # ------------------------------------------------------------------
    op.create_table(
        "alerts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("location_id", sa.Integer(), nullable=True),
        sa.Column("type", sa.String(length=100), nullable=False),
        sa.Column(
            "level",
            sa.String(length=50),
            nullable=True,
            server_default="warning",
            comment="info | warning | critical",
        ),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("threshold_value", sa.Float(), nullable=True),
        sa.Column("actual_value", sa.Float(), nullable=True),
        sa.Column(
            "is_acknowledged", sa.Boolean(), nullable=True, server_default="false"
        ),
        sa.Column("acknowledged_by", sa.Integer(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column("acknowledged_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["acknowledged_by"], ["users.id"], ondelete="SET NULL"
        ),
        sa.ForeignKeyConstraint(["location_id"], ["locations.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_alerts_id"), "alerts", ["id"], unique=False)
    op.create_index(
        op.f("ix_alerts_location_id"), "alerts", ["location_id"], unique=False
    )
    op.create_index(
        op.f("ix_alerts_created_at"), "alerts", ["created_at"], unique=False
    )

    # ------------------------------------------------------------------
    # agent_conversations table
    # ------------------------------------------------------------------
    op.create_table(
        "agent_conversations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("title", sa.String(length=255), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_agent_conversations_id"), "agent_conversations", ["id"], unique=False
    )
    op.create_index(
        op.f("ix_agent_conversations_user_id"),
        "agent_conversations",
        ["user_id"],
        unique=False,
    )

    # ------------------------------------------------------------------
    # agent_messages table
    # ------------------------------------------------------------------
    op.create_table(
        "agent_messages",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("conversation_id", sa.Integer(), nullable=False),
        sa.Column(
            "role",
            sa.String(length=20),
            nullable=False,
            comment="user | assistant | tool",
        ),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column(
            "tool_calls_json",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["conversation_id"], ["agent_conversations.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_agent_messages_id"), "agent_messages", ["id"], unique=False
    )
    op.create_index(
        op.f("ix_agent_messages_conversation_id"),
        "agent_messages",
        ["conversation_id"],
        unique=False,
    )

    # ------------------------------------------------------------------
    # simulation_results table
    # ------------------------------------------------------------------
    op.create_table(
        "simulation_results",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("location_id", sa.Integer(), nullable=True),
        sa.Column("current_counters", sa.Integer(), nullable=False),
        sa.Column("proposed_counters", sa.Integer(), nullable=False),
        sa.Column("current_wait", sa.Float(), nullable=False),
        sa.Column("predicted_wait", sa.Float(), nullable=False),
        sa.Column("time_saved", sa.Float(), nullable=False),
        sa.Column(
            "inputs_json",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
            server_default="{}",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["location_id"], ["locations.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_simulation_results_id"), "simulation_results", ["id"], unique=False
    )

    # ------------------------------------------------------------------
    # audit_logs table
    # ------------------------------------------------------------------
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("action", sa.String(length=100), nullable=False),
        sa.Column("resource", sa.String(length=100), nullable=True),
        sa.Column("resource_id", sa.String(length=100), nullable=True),
        sa.Column(
            "details_json",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
            server_default="{}",
        ),
        sa.Column("ip_address", sa.String(length=45), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_audit_logs_id"), "audit_logs", ["id"], unique=False
    )
    op.create_index(
        op.f("ix_audit_logs_user_id"), "audit_logs", ["user_id"], unique=False
    )
    op.create_index(
        op.f("ix_audit_logs_created_at"), "audit_logs", ["created_at"], unique=False
    )
    op.create_index(
        op.f("ix_audit_logs_action"), "audit_logs", ["action"], unique=False
    )


def downgrade() -> None:
    # Drop tables in reverse dependency order
    op.drop_table("audit_logs")
    op.drop_table("simulation_results")
    op.drop_table("agent_messages")
    op.drop_table("agent_conversations")
    op.drop_table("alerts")
    op.drop_table("queue_history")
    op.drop_table("waiting_time_predictions")
    op.drop_table("crowd_detections")
    op.drop_table("counters")
    op.drop_table("queues")
    op.drop_table("locations")
    op.drop_table("facilities")
    op.drop_table("users")
    op.drop_table("roles")
