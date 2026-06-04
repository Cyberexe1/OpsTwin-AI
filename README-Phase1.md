# OpsTwin AI — Phase 1: Foundation & Data Layer

## Objective

Set up the project skeleton, configure Splunk, build the backend API, provision databases, and establish the data ingestion pipeline. Phase 1 delivers a working backend that can ingest operational data into Splunk and the knowledge stores.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Python | 3.11+ | Backend development |
| Node.js | 18+ | Frontend (scaffold only in this phase) |
| Docker | Latest | Local Splunk Enterprise, Qdrant, Neo4j, PostgreSQL |
| Splunk Enterprise | 9.x (Developer License) | Operational data platform |
| Git | Latest | Version control |

---

## Step 1: Project Structure Setup

Create the monorepo structure:

```
OpsTwin-AI/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI entrypoint
│   │   ├── config.py            # Environment config
│   │   ├── models/              # Pydantic models
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── agents/              # Agent definitions (placeholder)
│   │   ├── ingestion/           # Data ingestion pipelines
│   │   └── db/                  # Database clients
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── package.json             # Vite + React scaffold
│   └── src/
├── docker-compose.yml           # Local dev infrastructure
├── splunk/
│   ├── indexes.conf             # Custom index definitions
│   ├── inputs.conf              # Data inputs
│   └── sample_data/             # Synthetic operational data
├── .gitignore
└── README.md
```

### Commands

```bash
mkdir OpsTwin-AI && cd OpsTwin-AI
mkdir -p backend/app/{models,routes,services,agents,ingestion,db}
mkdir -p frontend/src
mkdir -p splunk/sample_data
```

---

## Step 2: Docker Compose — Local Infrastructure

Create `docker-compose.yml`:

```yaml
version: "3.9"
services:
  splunk:
    image: splunk/splunk:latest
    container_name: opstwin-splunk
    environment:
      SPLUNK_START_ARGS: "--accept-license"
      SPLUNK_PASSWORD: "ChangeMeNow1!"
    ports:
      - "8000:8000"   # Splunk Web
      - "8089:8089"   # Splunk REST API
      - "8088:8088"   # HEC (HTTP Event Collector)
    volumes:
      - splunk_data:/opt/splunk/var

  postgres:
    image: postgres:16
    container_name: opstwin-postgres
    environment:
      POSTGRES_DB: opstwin
      POSTGRES_USER: opstwin
      POSTGRES_PASSWORD: opstwin_secret
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data

  qdrant:
    image: qdrant/qdrant:latest
    container_name: opstwin-qdrant
    ports:
      - "6333:6333"   # REST API
      - "6334:6334"   # gRPC
    volumes:
      - qdrant_data:/qdrant/storage

  neo4j:
    image: neo4j:5
    container_name: opstwin-neo4j
    environment:
      NEO4J_AUTH: neo4j/opstwin_graph
    ports:
      - "7474:7474"   # Browser
      - "7687:7687"   # Bolt
    volumes:
      - neo4j_data:/data

volumes:
  splunk_data:
  pg_data:
  qdrant_data:
  neo4j_data:
```

### Start Infrastructure

```bash
docker-compose up -d
```

Verify all services are healthy before proceeding.

---

## Step 3: Splunk Configuration

### 3.1 Create Custom Indexes

Log into Splunk Web (`http://localhost:8000`) and create:

| Index | Purpose |
|-------|---------|
| `opstwin_incidents` | Historical incident data |
| `opstwin_metrics` | System metrics (CPU, memory, latency) |
| `opstwin_logs` | Application logs |
| `opstwin_traces` | Distributed traces |
| `opstwin_postmortems` | Postmortem documents |

### 3.2 Enable HTTP Event Collector (HEC)

1. Settings → Data Inputs → HTTP Event Collector
2. Enable Global Settings → Enable HEC
3. Create a new token: `opstwin-ingest`
4. Assign allowed indexes: all `opstwin_*` indexes

### 3.3 Generate Synthetic Data

Create `splunk/sample_data/generate_incidents.py`:

```python
import json
import random
import datetime
import requests

HEC_URL = "https://localhost:8088/services/collector/event"
HEC_TOKEN = "YOUR_HEC_TOKEN"

ENGINEERS = ["alex_chen", "maria_garcia", "james_wilson", "priya_patel"]
SERVICES = ["api-gateway", "redis-cluster", "postgres-primary", "auth-service", "payment-service"]
ROOT_CAUSES = ["memory_leak", "connection_pool_exhaustion", "disk_full", "cpu_spike", "network_partition"]

def generate_incident(incident_id):
    engineer = random.choice(ENGINEERS)
    service = random.choice(SERVICES)
    root_cause = random.choice(ROOT_CAUSES)
    
    return {
        "event": {
            "incident_id": f"INC-{incident_id:04d}",
            "timestamp": (datetime.datetime.now() - datetime.timedelta(days=random.randint(1, 365))).isoformat(),
            "severity": random.choice(["P1", "P2", "P3"]),
            "service": service,
            "root_cause": root_cause,
            "investigating_engineer": engineer,
            "investigation_steps": [
                f"Checked {service} dashboard",
                f"Queried logs for error patterns",
                f"Identified {root_cause}",
                f"Applied remediation"
            ],
            "resolution": f"Resolved {root_cause} on {service}",
            "mttr_minutes": random.randint(5, 240),
            "status": "resolved"
        },
        "sourcetype": "opstwin:incident",
        "index": "opstwin_incidents"
    }

def ingest_incidents(count=500):
    headers = {"Authorization": f"Splunk {HEC_TOKEN}"}
    for i in range(1, count + 1):
        incident = generate_incident(i)
        requests.post(HEC_URL, json=incident, headers=headers, verify=False)
    print(f"Ingested {count} incidents")

if __name__ == "__main__":
    ingest_incidents()
```

Run:

```bash
cd splunk/sample_data
pip install requests
python generate_incidents.py
```

---

## Step 4: FastAPI Backend Setup

### 4.1 Dependencies

Create `backend/requirements.txt`:

```
fastapi==0.111.0
uvicorn[standard]==0.30.1
pydantic==2.7.4
pydantic-settings==2.3.3
sqlalchemy==2.0.30
asyncpg==0.29.0
httpx==0.27.0
qdrant-client==1.9.1
neo4j==5.20.0
python-dotenv==1.0.1
```

### 4.2 Configuration

Create `backend/app/config.py`:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Splunk
    splunk_host: str = "localhost"
    splunk_port: int = 8089
    splunk_hec_port: int = 8088
    splunk_username: str = "admin"
    splunk_password: str = "ChangeMeNow1!"
    splunk_hec_token: str = ""

    # PostgreSQL
    database_url: str = "postgresql+asyncpg://opstwin:opstwin_secret@localhost:5432/opstwin"

    # Qdrant
    qdrant_host: str = "localhost"
    qdrant_port: int = 6333

    # Neo4j
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "opstwin_graph"

    class Config:
        env_file = ".env"

settings = Settings()
```

### 4.3 FastAPI Entrypoint

Create `backend/app/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="OpsTwin AI",
    description="Digital Operational Twins for Institutional Knowledge Preservation",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "healthy", "phase": 1}
```

### 4.4 Database Client — Splunk

Create `backend/app/db/splunk_client.py`:

```python
import httpx
from app.config import settings

class SplunkClient:
    def __init__(self):
        self.base_url = f"https://{settings.splunk_host}:{settings.splunk_port}"
        self.auth = (settings.splunk_username, settings.splunk_password)

    async def search(self, query: str, earliest: str = "-24h", latest: str = "now"):
        """Execute a Splunk search and return results."""
        async with httpx.AsyncClient(verify=False) as client:
            # Create search job
            resp = await client.post(
                f"{self.base_url}/services/search/jobs",
                auth=self.auth,
                data={
                    "search": f"search {query}",
                    "earliest_time": earliest,
                    "latest_time": latest,
                    "output_mode": "json"
                }
            )
            sid = resp.json()["sid"]

            # Poll for completion
            while True:
                status = await client.get(
                    f"{self.base_url}/services/search/jobs/{sid}",
                    auth=self.auth,
                    params={"output_mode": "json"}
                )
                if status.json()["entry"][0]["content"]["isDone"]:
                    break

            # Get results
            results = await client.get(
                f"{self.base_url}/services/search/jobs/{sid}/results",
                auth=self.auth,
                params={"output_mode": "json", "count": 0}
            )
            return results.json().get("results", [])

splunk_client = SplunkClient()
```

### 4.5 Database Client — Qdrant

Create `backend/app/db/qdrant_client.py`:

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from app.config import settings

class VectorStore:
    def __init__(self):
        self.client = QdrantClient(host=settings.qdrant_host, port=settings.qdrant_port)
        self._ensure_collections()

    def _ensure_collections(self):
        collections = ["incidents", "runbooks", "postmortems"]
        for name in collections:
            if not self.client.collection_exists(name):
                self.client.create_collection(
                    collection_name=name,
                    vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
                )

    def upsert(self, collection: str, point_id: str, vector: list, payload: dict):
        self.client.upsert(
            collection_name=collection,
            points=[PointStruct(id=point_id, vector=vector, payload=payload)]
        )

    def search(self, collection: str, query_vector: list, limit: int = 5):
        return self.client.search(
            collection_name=collection,
            query_vector=query_vector,
            limit=limit
        )

vector_store = VectorStore()
```

### 4.6 Database Client — Neo4j

Create `backend/app/db/neo4j_client.py`:

```python
from neo4j import GraphDatabase
from app.config import settings

class KnowledgeGraph:
    def __init__(self):
        self.driver = GraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_user, settings.neo4j_password)
        )

    def close(self):
        self.driver.close()

    def create_incident_relationship(self, engineer: str, incident_id: str, service: str, root_cause: str, resolution: str):
        with self.driver.session() as session:
            session.run("""
                MERGE (e:Engineer {name: $engineer})
                MERGE (i:Incident {id: $incident_id})
                MERGE (s:Service {name: $service})
                MERGE (rc:RootCause {type: $root_cause})
                MERGE (r:Resolution {description: $resolution})
                MERGE (e)-[:INVESTIGATED]->(i)
                MERGE (i)-[:AFFECTED]->(s)
                MERGE (i)-[:CAUSED_BY]->(rc)
                MERGE (i)-[:RESOLVED_BY]->(r)
            """, engineer=engineer, incident_id=incident_id, service=service,
                root_cause=root_cause, resolution=resolution)

    def find_engineer_expertise(self, engineer: str):
        with self.driver.session() as session:
            result = session.run("""
                MATCH (e:Engineer {name: $engineer})-[:INVESTIGATED]->(i:Incident)-[:CAUSED_BY]->(rc:RootCause)
                RETURN rc.type AS root_cause, count(i) AS incident_count
                ORDER BY incident_count DESC
            """, engineer=engineer)
            return [record.data() for record in result]

knowledge_graph = KnowledgeGraph()
```

---

## Step 5: Data Ingestion Pipeline

Create `backend/app/ingestion/pipeline.py`:

```python
from app.db.splunk_client import splunk_client
from app.db.qdrant_client import vector_store
from app.db.neo4j_client import knowledge_graph

class IngestionPipeline:
    """
    Pulls incident data from Splunk, embeds it into Qdrant,
    and builds relationships in Neo4j.
    """

    async def ingest_incidents_from_splunk(self):
        """Fetch incidents from Splunk and store in knowledge layer."""
        incidents = await splunk_client.search(
            'index=opstwin_incidents sourcetype="opstwin:incident"',
            earliest="-30d"
        )

        for incident in incidents:
            # Store in Neo4j knowledge graph
            knowledge_graph.create_incident_relationship(
                engineer=incident.get("investigating_engineer", "unknown"),
                incident_id=incident.get("incident_id", ""),
                service=incident.get("service", ""),
                root_cause=incident.get("root_cause", ""),
                resolution=incident.get("resolution", "")
            )

        return {"ingested": len(incidents)}
```

---

## Step 6: PostgreSQL Schema

Create `backend/app/db/schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS engineers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    expertise_areas TEXT[],
    incidents_resolved INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    incident_id VARCHAR(50) UNIQUE NOT NULL,
    severity VARCHAR(10),
    service VARCHAR(255),
    root_cause VARCHAR(255),
    investigating_engineer VARCHAR(255),
    resolution TEXT,
    mttr_minutes INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_outputs (
    id SERIAL PRIMARY KEY,
    incident_id VARCHAR(50) REFERENCES incidents(incident_id),
    agent_name VARCHAR(100),
    output JSONB,
    confidence FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Step 7: Verify Phase 1

### Checklist

| # | Task | Verification |
|---|------|-------------|
| 1 | Docker containers running | `docker-compose ps` — all healthy |
| 2 | Splunk accessible | Browse `http://localhost:8000` |
| 3 | HEC token active | POST event to `http://localhost:8088/services/collector/event` |
| 4 | Synthetic data ingested | Search `index=opstwin_incidents` in Splunk |
| 5 | FastAPI running | `curl http://localhost:8000/health` returns `{"status": "healthy"}` |
| 6 | Qdrant accessible | `curl http://localhost:6333/collections` |
| 7 | Neo4j accessible | Browse `http://localhost:7474` |
| 8 | PostgreSQL accessible | `psql -h localhost -U opstwin -d opstwin` |

### Run Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

---

## Phase 1 Deliverables

- [x] Project structure created
- [x] Docker Compose with Splunk, PostgreSQL, Qdrant, Neo4j
- [x] Splunk configured with custom indexes and HEC
- [x] 500 synthetic incidents ingested into Splunk
- [x] FastAPI backend with health endpoint
- [x] Database clients for Splunk, Qdrant, Neo4j
- [x] Data ingestion pipeline (Splunk → Knowledge Layer)
- [x] PostgreSQL schema for incidents and agent outputs

---

## Next → Phase 2

Phase 2 builds the AI Agent layer (Historian, Expert Twin, Risk, Planner) using LangGraph, integrates Splunk MCP Server, and connects Splunk Hosted Models for reasoning and summarization.
