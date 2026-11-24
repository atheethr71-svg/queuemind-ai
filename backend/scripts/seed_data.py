"""seed_data.py - QueueMind AI portable database seeder.
Works seamlessly with PostgreSQL and SQLite.
"""
import os
import sys
import random
from datetime import datetime, timedelta, timezone

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(SCRIPT_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.database.base import SessionLocal, create_tables
from app.core.security import get_password_hash
from app.models.user import User, Role
from app.models.facility import Facility, Location
from app.models.queue import Queue, QueueHistory, Counter
from app.models.alert import Alert
from app.models.detection import CrowdDetection
from app.models.audit import AuditLog


def seed_database(db=None):
    close_when_done = False
    if db is None:
        create_tables()
        db = SessionLocal()
        close_when_done = True

    try:
        # Check if already seeded
        if db.query(User).filter(User.email == "admin@queuemind.ai").first():
            print("Database already contains seed admin user.")
            return

        print("🌱 Seeding QueueMind AI database...")

        # 1. Users
        admin = User(
            email="admin@queuemind.ai",
            hashed_password=get_password_hash("Admin@123"),
            full_name="Facility Administrator",
            role="admin",
            is_active=True
        )
        operator = User(
            email="operator@queuemind.ai",
            hashed_password=get_password_hash("Op@123"),
            full_name="Service Counter Operator",
            role="operator",
            is_active=True
        )
        db.add_all([admin, operator])
        db.commit()
        db.refresh(admin)
        db.refresh(operator)

        # 2. Facilities & Locations
        facilities_data = [
            {
                "name": "Central College Canteen",
                "type": "Canteen",
                "address": "Campus Block B, Food Court",
                "locations": [
                    {"name": "Main Meal Counter", "type": "Food Service", "capacity": 120},
                    {"name": "Quick Snacks & Beverages", "type": "Express", "capacity": 60},
                    {"name": "Recharge & Billing Desk", "type": "Payment", "capacity": 40},
                ]
            },
            {
                "name": "City General Hospital",
                "type": "Hospital",
                "address": "Health Avenue, North Wing",
                "locations": [
                    {"name": "OPD Registration Desk", "type": "Registration", "capacity": 150},
                    {"name": "Central Pharmacy", "type": "Pharmacy", "capacity": 80},
                    {"name": "Diagnostic Lab Collection", "type": "Laboratory", "capacity": 70},
                ]
            },
            {
                "name": "Metro Commercial Bank",
                "type": "Bank",
                "address": "Downtown Financial Plaza",
                "locations": [
                    {"name": "Cash Deposit & Withdrawal", "type": "Teller", "capacity": 80},
                    {"name": "Customer Support & Accounts", "type": "Advisory", "capacity": 50},
                ]
            }
        ]

        all_locations = []
        for f_data in facilities_data:
            fac = Facility(
                name=f_data["name"],
                type=f_data["type"],
                address=f_data["address"],
                admin_id=admin.id
            )
            db.add(fac)
            db.commit()
            db.refresh(fac)

            for loc_data in f_data["locations"]:
                loc = Location(
                    facility_id=fac.id,
                    name=loc_data["name"],
                    type=loc_data["type"],
                    max_capacity=loc_data["capacity"]
                )
                db.add(loc)
                db.commit()
                db.refresh(loc)
                all_locations.append(loc)

        # 3. Queues and Counters for each location
        for loc in all_locations:
            initial_length = random.randint(6, 28)
            queue = Queue(
                location_id=loc.id,
                current_length=initial_length,
                status="active"
            )
            db.add(queue)
            db.commit()
            db.refresh(queue)

            # 4 counters per location
            for i in range(1, 5):
                status_val = "active" if i <= 3 else "inactive"
                counter = Counter(
                    location_id=loc.id,
                    name=f"Counter {i}",
                    status=status_val,
                    operator_id=operator.id if i == 1 else None,
                    avg_service_time=round(random.uniform(3.5, 6.0), 1),
                    served_today=random.randint(25, 95)
                )
                db.add(counter)

            # Queue history (past 24 hours)
            now = datetime.utcnow()
            for h in range(24, 0, -2):
                hist_time = now - timedelta(hours=h)
                hour_of_day = hist_time.hour
                # Rush hour curve
                if 8 <= hour_of_day <= 10 or 12 <= hour_of_day <= 14 or 17 <= hour_of_day <= 19:
                    h_length = random.randint(22, 45)
                else:
                    h_length = random.randint(3, 16)
                
                qh = QueueHistory(
                    queue_id=queue.id,
                    length=h_length,
                    timestamp=hist_time,
                    source="system_sensor"
                )
                db.add(qh)

        db.commit()

        # 4. Alerts
        sample_alerts = [
            ("queue_length_exceeded", "critical", "Queue length exceeded threshold (38 waiting at OPD Registration)", 20.0, 38.0, False),
            ("wait_time_high", "warning", "Average waiting time reached 18.5 minutes at Main Meal Counter", 15.0, 18.5, False),
            ("counter_inactive", "warning", "Counter 4 remains inactive during peak hour lunch rush", None, None, True),
            ("crowd_surge", "critical", "Sudden arrival surge of +16 people detected within 5 minutes", 10.0, 16.0, False),
            ("service_delay", "warning", "Counter 2 average service time increased to 8.2 minutes", 6.0, 8.2, True),
        ]
        for a_type, a_lvl, msg, thresh, actual, ack in sample_alerts:
            alert = Alert(
                location_id=all_locations[0].id,
                type=a_type,
                level=a_lvl,
                message=msg,
                threshold_value=thresh,
                actual_value=actual,
                is_acknowledged=ack,
                acknowledged_by=admin.id if ack else None,
                acknowledged_at=datetime.utcnow() if ack else None,
                created_at=datetime.utcnow() - timedelta(minutes=random.randint(5, 120))
            )
            db.add(alert)

        # 5. Detections
        for i in range(5):
            det = CrowdDetection(
                location_id=all_locations[0].id,
                people_count=random.randint(12, 34),
                density_level="moderate" if i % 2 == 0 else "high",
                confidence=round(random.uniform(0.85, 0.96), 2),
                model_used="yolov8n",
                is_demo=True,
                created_at=datetime.utcnow() - timedelta(minutes=i * 15)
            )
            db.add(det)

        # 6. Audit log
        db.add(AuditLog(
            user_id=admin.id,
            action="database_seed",
            resource="system",
            details_json={"facilities": len(facilities_data), "locations": len(all_locations)},
            ip_address="127.0.0.1"
        ))

        db.commit()
        print("✅ Database seeding completed successfully!")
        print("   Admin credentials   : admin@queuemind.ai / Admin@123")
        print("   Operator credentials: operator@queuemind.ai / Op@123")

    except Exception as e:
        db.rollback()
        print(f"❌ Seeding error: {e}")
        raise
    finally:
        if close_when_done:
            db.close()


def seed():
    seed_database()


if __name__ == "__main__":
    seed()
