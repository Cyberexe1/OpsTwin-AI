# OpsTwin AI

> **Preserving Institutional Knowledge Through Agentic Operations**

**Track:** Observability | **Hackathon:** Splunk Agentic Ops 2025

### 🔗 Live Demo: [https://ops-twin-ai.vercel.app](https://ops-twin-ai.vercel.app)

**Login:** `demo@opstwin.ai` / `demo1234`

---

## The Problem

When senior engineers leave, organizations lose years of operational expertise. MTTR increases 3x, incidents recur, and teams repeat past mistakes. Current observability tools monitor systems but don't preserve the expertise needed to interpret that data.

## The Solution

OpsTwin AI creates Digital Operational Twins of expert engineers. It learns investigation patterns from Splunk data and when incidents occur, 4 AI agents collaborate to reproduce the expert's reasoning — delivering a resolution plan in seconds instead of hours.

---

## Architecture

```
                    Splunk Enterprise 10.4
                           │
              ┌────────────┴────────────┐
              │   Splunk MCP Layer       │
              │   (Sole data access)     │
              └────────────┬────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
   Historian Agent   Expert Twin Agent   Risk Agent
   (Find similar)   (Simulate expert)   (Blast radius)
         │                 │                 │
         └────────┬────────┴─────────────────┘
                  ▼
         Resolution Planner Agent
         (Generate action plan)
                  │
                  ▼
            FastAPI + LangGraph
                  │
         ┌────────┼────────┐
         │        │        │
         ▼        ▼        ▼
      Groq LLM  Neon DB  Splunk ML
      (Reason)  (Store)  (Predict)
                  │
                  ▼
         React Dashboard
```

---

## Splunk Integration (Deep)

### Splunk MCP Server
All 4 agents access Splunk exclusively through our MCP service layer. No agent queries Splunk directly. The MCP layer provides structured tools:
- `search_splunk` — Execute any SPL query
- `get_incidents` — Retrieve historical incidents by service/root cause
- `get_engineer_history` — Get an engineer's investigation patterns
- `find_best_expert` — Rank engineers by effectiveness for a service
- `get_service_dependencies` — Map blast radius

### Splunk ML Models (Native)
Statistical and predictive models run inside Splunk via SPL:
- **Anomaly Detection** — Z-score analysis identifies unusual incident patterns
- **Root Cause Predictor** — Frequency-based prediction per service+severity
- **MTTR Estimator** — Percentile analysis (avg, median, P90) from historical data
- **Expert Ranking** — Effectiveness scoring (speed × volume)

### Hosted LLM Integration
Groq (Llama 3.3 70B) processes Splunk query results for:
- Incident summarization
- Expert behavior simulation
- Risk assessment generation
- Resolution plan synthesis

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React, Vite, Tailwind CSS | Dashboard UI |
| Backend | FastAPI, Python | API + agent orchestration |
| Orchestration | LangGraph | Multi-agent workflow |
| LLM | Groq (Llama 3.3 70B) | Reasoning + generation |
| Data Platform | Splunk Enterprise 10.4 | Operational data + ML |
| MCP Layer | Custom MCP Service | Agent-to-Splunk interface |
| Database | Neon PostgreSQL | Users + investigation history |
| Auth | JWT (python-jose) | Secure authentication |

---

## How It Works

1. **User triggers investigation** — selects service, symptoms, severity
2. **Historian Agent** queries Splunk for similar past incidents + runs ML prediction
3. **Expert Twin Agent** finds the best engineer for this issue, simulates their reasoning
4. **Risk Agent** calculates blast radius and ranks remediation actions by safety
5. **Resolution Planner** merges all findings into a step-by-step plan with confidence score
6. **Result persisted** to PostgreSQL for future reference
7. **User approves** the plan and executes remediation

---

## Key Features

- 4 specialized AI agents (not a chatbot)
- Real Splunk queries on 500+ historical incidents
- Engineer specialization patterns (Alex=Redis, Maria=Auth, etc.)
- Splunk-native ML for anomaly detection and prediction
- JWT authentication with Neon PostgreSQL
- All investigation results persisted to database
- Graceful fallback — works without LLM key (template responses)
- Professional dark-mode dashboard matching stitch designs

---

## How to Run

### Prerequisites
- Python 3.13+
- Node.js 18+
- Splunk Enterprise (Developer License)
- Groq API key (free at console.groq.com)
- Neon PostgreSQL database (free at neon.tech)

### 1. Splunk
```bash
# Splunk should be running on localhost:8000
# Create index: opstwin_incidents
# Enable HEC, create token
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt

# Configure credentials
cp .env.example .env
# Edit .env with your Splunk, Groq, Neon credentials

# Seed demo user
python scripts/seed_demo_user.py

# Generate realistic incident data
python scripts/generate_incidents.py

# Start server
uvicorn app.main:app --reload --port 8001
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Access
- **Frontend:** http://localhost:5174
- **Backend API:** http://localhost:8001/docs
- **Splunk:** http://localhost:8000
- **Demo login:** `demo@opstwin.ai` / `demo1234`

---

## Deployment (Production)

The application is deployed across three services:

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Vercel (free) | https://ops-twin-ai.vercel.app |
| Backend + Splunk | AWS EC2 `t3.large` | `44.222.62.149:8001` |
| Database | Neon PostgreSQL (free) | Cloud-hosted |

### Architecture

```
Vercel (HTTPS)                     AWS EC2 t3.large
┌──────────────────┐               ┌──────────────────────────┐
│ React Frontend   │──rewrites──▶ │ FastAPI Backend (:8001)   │
│ ops-twin-ai      │               │ Splunk Enterprise (:8000) │
│ .vercel.app      │               │ Splunk HEC (:8088)        │
└──────────────────┘               └──────────────────────────┘
                                              │
                                   Neon PostgreSQL (cloud)
                                   Groq LLM API (cloud)
```

### How It's Deployed

**Frontend (Vercel):**
- Auto-deploys from GitHub on push
- Uses `vercel.json` rewrites to proxy `/api/*` requests to EC2 backend
- Solves HTTPS → HTTP mixed content issue without needing SSL on EC2

**Backend + Splunk (AWS EC2):**
- Ubuntu 22.04, `t3.large` (2 vCPU, 8GB RAM)
- Splunk Enterprise 9.3.1 with Developer License
- FastAPI running as systemd service (`opstwin.service`)
- 500 realistic incidents pre-loaded via HEC
- Security group allows ports: 22, 80, 443, 8000, 8001, 8088

**Database (Neon):**
- PostgreSQL with `users` and `investigations` tables
- Demo user pre-seeded
- All investigation results persisted automatically

---

## Project Structure

```
OpsTwin-AI/
├── frontend/src/
│   ├── pages/           # Landing, Login, Dashboard, Investigate, etc.
│   ├── components/      # Shared layout (sidebar, header)
│   └── lib/             # API client, JWT auth
├── backend/app/
│   ├── agents/          # Historian, Expert Twin, Risk, Planner, Orchestrator
│   ├── services/        # MCP client, Splunk ML, LLM, Splunk REST client
│   ├── routes/          # Auth, Investigations, Health
│   └── db/              # PostgreSQL models + connection
├── backend/scripts/
│   ├── generate_incidents.py  # 500 realistic incidents with engineer patterns
│   └── seed_demo_user.py     # Create demo user in Neon
└── README.md
```

---

## Prize Alignment

| Prize | Evidence |
|-------|----------|
| 🏆 Grand Prize | Novel concept (Digital Twins) + multi-agent architecture + full working demo |
| 🏆 Best of Observability | AI-powered incident investigation preserving operational expertise |
| 🏆 Best Use of Splunk MCP Server | All agents access Splunk exclusively through MCP service layer |
| 🏆 Best Use of Splunk Hosted Models | Splunk-native ML (anomaly detection, prediction, MTTR estimation) + LLM reasoning on Splunk data |

---

## Demo Credentials

| Service | Credentials |
|---------|------------|
| Dashboard | `demo@opstwin.ai` / `demo1234` |
| Splunk Web | Your local admin credentials |
| API Docs | http://localhost:8001/docs (no auth needed) |

---

## License

MIT
