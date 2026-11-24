# QueueMind AI – Smart Queue Monitoring & Predictive Management System

> **HACKATHON TRACK 2: BEYOND THE BROWSER – REIMAGINE HOW WE USE THE WEB**  
> An autonomous browser-based AI agent that senses real-time queue crowding via computer vision, forecasts waiting times with dynamic M/M/c queueing theory, simulates counter allocations, and orchestrates physical service operations.

---

## 🌐 Live Production Application

- **Live URL:** [https://frontend-alpha-one-w1b14oacv8.vercel.app](https://frontend-alpha-one-w1b14oacv8.vercel.app)
- **Interactive Executive Dashboard:** [https://frontend-alpha-one-w1b14oacv8.vercel.app/dashboard/overview](https://frontend-alpha-one-w1b14oacv8.vercel.app/dashboard/overview)
- **Smart Allocation Simulator:** [https://frontend-alpha-one-w1b14oacv8.vercel.app/dashboard/simulator](https://frontend-alpha-one-w1b14oacv8.vercel.app/dashboard/simulator)
- **Preloaded Credentials:** `admin@queuemind.ai` / `Admin@123` *(1-Click Instant Login)*

---

## 🏛️ System Architecture

```text
+-----------------------------------------------------------------------------------+
|                              QUEUEMIND AI PLATFORM                                |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                  FRONTEND (Next.js 14 + Tailwind CSS + shadcn)            |   |
|   |  - Executive Dashboard           - Live Monitor & WebSockets             |   |
|   |  - Computer Vision Uploader      - Dynamic Wait Time Calculator          |   |
|   |  - Smart Counter Simulator       - Autonomous Browser Operations Agent   |   |
|   |  - Multi-Facility Hierarchy      - Historical Analytics & CSV Export     |   |
|   +---------------------------------------+-----------------------------------+   |
|                                           | REST & WebSockets                     |
|                                           v                                       |
|   +---------------------------------------------------------------------------+   |
|   |                   BACKEND ORCHESTRATION (FastAPI 3.11)                   |   |
|   |  - Role-based Auth (JWT)         - Real-Time WebSocket Manager           |   |
|   |  - Queue & Counter Engine        - Alerts & Incident Evaluation          |   |
|   |  - Simulation Math Service       - Autonomous Agent Tool Dispatcher      |   |
|   +------------------+--------------------+-------------------+---------------+   |
|                      |                    |                   |                   |
|                      v                    v                   v                   |
|   +----------------------+  +---------------------+  +------------------------+   |
|   |      AI ENGINE       |  |      DATABASE       |  |     AWS CLOUD SPONSOR  |   |
|   |  (FastAPI Port 8001) |  |  PostgreSQL / ORM   |  |  - AWS S3 (Media)      |   |
|   |  - YOLOv8 Person Det |  |  (SQLite Fallback)  |  |  - AWS SNS (Alerts)    |   |
|   |  - M/M/c Predictor   |  |  - Seeded Facilities|  |  - AWS CloudWatch Logs |   |
|   |  - LLM Agent Tools   |  |  - 7-Day History    |  |  - RDS PostgreSQL      |   |
|   +----------------------+  +---------------------+  +------------------------+   |
+-----------------------------------------------------------------------------------+
```

---

## 🚀 Key Innovation Highlights

1. **Autonomous Browser Operations Agent (Track 2):**  
   Goes beyond traditional static dashboards. Administrators interact with a conversational operational agent that retrieves live sensor data, models congestion, executes counter allocation simulations, and carries out counter activation actions with permission safeguards.

2. **Computer Vision Crowd Sensing:**  
   Integrates YOLOv8 person detection with crowd density classification (Low, Moderate, High, Critical) and automatic bounding box visualization. Privacy-first architecture: strictly zero facial recognition or identity tracking.

3. **Mathematical Waiting-Time Prediction Engine:**  
   Replaces static estimates with dynamic $M/M/c$ probabilistic queueing equations calibrated with historical rush-hour multipliers (morning, lunch, and evening surges).

4. **Smart Counter Allocation Simulator:**  
   Interactive mathematical testbed that computes instantaneous changes in wait times, customer throughput, and counter utilisation when opening or closing service counters.

5. **AWS Cloud Integration:**  
   - **AWS S3:** Secure encrypted storage for queue imagery and video samples.
   - **AWS SNS:** Real-time push notifications for warning and critical queue thresholds.
   - **AWS CloudWatch:** Centralized service telemetry and operational audit logging.

---

## 🔑 Demonstration Accounts

The system comes pre-seeded with full facilities and historical data:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Facility Administrator** | `admin@queuemind.ai` | `Admin@123` | Full administrative control, counter simulator, AI agent execution |
| **Counter Operator** | `operator@queuemind.ai` | `Op@123` | Service lane status management, queue viewing, alert acknowledgment |

*(Both accounts feature a 1-Click Quick-Fill button on the login screen).*

---

## ⚡ Quick Start: Running Locally

### Option A: Complete Docker Compose (Recommended)

```bash
# Clone and enter project directory
cd queuemind-ai

# Copy environment variables
cp .env.example .env

# Launch all microservices (Postgres, Redis, Backend, AI Engine, Frontend)
docker-compose up --build
```

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend Swagger API:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **AI Engine API:** [http://localhost:8001/docs](http://localhost:8001/docs)

---

### Option B: Local Development (Without Docker)

The application includes an automatic SQLite fallback and automatic demo database seeder so you can run it immediately without external database servers.

#### 1. Start the Backend API
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
*Backend runs on `http://localhost:8000` and automatically populates demo data.*

#### 2. Start the AI Engine
```bash
cd ai-engine
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
python main.py
```
*AI Engine runs on `http://localhost:8001`.*

#### 3. Start the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## 📡 REST API Reference

### Authentication
- `POST /api/v1/auth/register` – Register new facility administrator
- `POST /api/v1/auth/login` – Obtain JWT bearer token
- `GET /api/v1/auth/me` – Current authenticated user profile

### Dashboard & Telemetry
- `GET /api/v1/dashboard/overview` – Consolidated real-time metrics
- `GET /api/v1/dashboard/trends` – 7-day wait times and queue lengths
- `WS  /ws/queues` – Real-time WebSocket event broadcaster

### Queue & Counter Management
- `GET   /api/v1/queues` – List queues per location
- `PATCH /api/v1/queues/{id}` – Update queue length or status
- `GET   /api/v1/counters` – List service counters
- `PATCH /api/v1/counters/{id}` – Activate or close counter
- `POST  /api/v1/counters/simulate` – Run counter allocation simulator
- `POST  /api/v1/counters/apply-recommendation` – Deploy simulated configuration

### AI & Vision
- `POST /api/v1/detection/image` – Upload queue image for YOLO crowd estimation
- `POST /api/v1/predictions/waiting-time` – Calculate probabilistic wait time
- `POST /api/v1/agent/chat` – Query the Autonomous Operations Agent

### Analytics & Alerts
- `GET   /api/v1/alerts` – List warning and critical queue incidents
- `PATCH /api/v1/alerts/{id}/acknowledge` – Mark incident acknowledged
- `GET   /api/v1/analytics/peak-hours` – Hourly queue congestion breakdown
- `GET   /api/v1/analytics/export` – Download CSV audit report

---

## 🛡️ Privacy & Compliance Guarantee

QueueMind AI is engineered with strict ethical principles:
- **No Facial Recognition:** Uses generic person bounding boxes only.
- **No Personal Identity Storing:** Video frames are processed in-memory and discarded.
- **Role-Based Safeguards:** The AI Agent never applies changes without administrator confirmation.
