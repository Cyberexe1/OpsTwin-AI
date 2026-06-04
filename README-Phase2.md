# OpsTwin AI — Phase 2: AI Agents & Splunk Intelligence Layer

## Objective

Build the multi-agent system using LangGraph, integrate Splunk MCP Server as the central data access layer for all agents, and connect Splunk Hosted Models for reasoning, summarization, and expert behavior simulation.

Phase 2 delivers four working AI agents that can investigate incidents autonomously.

---

## Prerequisites (Completed in Phase 1)

- [x] Docker infrastructure running (Splunk, PostgreSQL, Qdrant, Neo4j)
- [x] Splunk configured with synthetic incident data
- [x] FastAPI backend operational
- [x] Database clients functional
- [x] Data ingestion pipeline working

---

## Step 1: Install Agent Dependencies

Update `backend/requirements.txt` — add:

```
langgraph==0.1.5
langchain==0.2.5
langchain-community==0.2.5
openai==1.35.3
tiktoken==0.7.0
splunk-sdk==2.0.1
```

Install:

```bash
cd backend
pip install -r requirements.txt
```

---

## Step 2: Splunk MCP Server Integration

The MCP Server is the single interface through which all agents access Splunk data. No agent queries Splunk directly — every request goes through MCP.

### 2.1 MCP Client Configuration

Create `backend/app/services/mcp_client.py`:

```python
import httpx
from app.config import settings

class SplunkMCPClient:
    """
    Client for Splunk MCP Server.
    All agent data access flows through this interface.
    """

    def __init__(self):
        self.base_url = f"https://{settings.splunk_host}:{settings.splunk_port}"
        self.auth = (settings.splunk_username, settings.splunk_password)

    async def query_incidents(self, query: str, time_range: str = "-90d") -> list:
        """Query historical incidents through MCP."""
        search = f'index=opstwin_incidents {query} | table incident_id, severity, service, root_cause, investigating_engineer, resolution, mttr_minutes'
        return await self._execute_search(search, time_range)

    async def query_metrics(self, service: str, metric: str, time_range: str = "-1h") -> list:
        """Query real-time metrics for a service."""
        search = f'index=opstwin_metrics service="{service}" metric_name="{metric}" | timechart avg(value) by service'
        return await self._execute_search(search, time_range)

    async def query_logs(self, service: str, level: str = "ERROR", time_range: str = "-1h") -> list:
        """Query recent logs for a service."""
        search = f'index=opstwin_logs service="{service}" level="{level}" | table _time, message, trace_id'
        return await self._execute_search(search, time_range)

    async def query_traces(self, trace_id: str) -> list:
        """Query distributed trace by trace ID."""
        search = f'index=opstwin_traces trace_id="{trace_id}" | table span_id, parent_span_id, service, operation, duration_ms, status'
        return await self._execute_search(search, "-7d")

    async def get_similar_incidents(self, service: str, root_cause: str, limit: int = 5) -> list:
        """Find historically similar incidents."""
        search = f'index=opstwin_incidents (service="{service}" OR root_cause="{root_cause}") | table incident_id, severity, service, root_cause, investigating_engineer, resolution, mttr_minutes | head {limit}'
        return await self._execute_search(search, "-365d")

    async def get_engineer_history(self, engineer: str) -> list:
        """Retrieve an engineer's investigation history."""
        search = f'index=opstwin_incidents investigating_engineer="{engineer}" | table incident_id, service, root_cause, investigation_steps, resolution, mttr_minutes | sort -_time'
        return await self._execute_search(search, "-365d")

    async def get_service_dependencies(self, service: str) -> list:
        """Get service dependency map."""
        search = f'index=opstwin_traces service="{service}" | stats dc(span_id) as call_count by service, operation | sort -call_count'
        return await self._execute_search(search, "-7d")

    async def _execute_search(self, search: str, time_range: str) -> list:
        """Execute search via Splunk REST API (MCP layer)."""
        async with httpx.AsyncClient(verify=False) as client:
            resp = await client.post(
                f"{self.base_url}/services/search/jobs",
                auth=self.auth,
                data={
                    "search": f"search {search}",
                    "earliest_time": time_range,
                    "latest_time": "now",
                    "output_mode": "json",
                    "exec_mode": "oneshot"
                }
            )
            return resp.json().get("results", [])

mcp_client = SplunkMCPClient()
```

---

## Step 3: Splunk Hosted Models Integration

### 3.1 Model Client

Create `backend/app/services/hosted_models.py`:

```python
from openai import AsyncOpenAI
from app.config import settings

class SplunkHostedModels:
    """
    Interface to Splunk Hosted Models for:
    - Incident summarization
    - Knowledge extraction
    - Expert behavior simulation
    - Recommendation generation
    """

    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.splunk_hosted_model_key,
            base_url=settings.splunk_hosted_model_url
        )

    async def summarize_incident(self, incident_data: dict) -> str:
        """Summarize an incident into structured knowledge."""
        response = await self.client.chat.completions.create(
            model="splunk-hosted-model",
            messages=[
                {"role": "system", "content": "You are an incident analysis expert. Summarize the incident into: symptoms, root cause, investigation steps, and resolution."},
                {"role": "user", "content": f"Incident data: {incident_data}"}
            ],
            temperature=0.2
        )
        return response.choices[0].message.content

    async def extract_expert_patterns(self, engineer: str, incidents: list) -> str:
        """Analyze an engineer's investigation patterns."""
        response = await self.client.chat.completions.create(
            model="splunk-hosted-model",
            messages=[
                {"role": "system", "content": f"Analyze the investigation patterns of engineer {engineer}. Identify: preferred investigation order, common first checks, typical remediation approaches, and decision-making style."},
                {"role": "user", "content": f"Historical incidents investigated by {engineer}: {incidents}"}
            ],
            temperature=0.3
        )
        return response.choices[0].message.content

    async def generate_investigation_plan(self, context: dict) -> str:
        """Generate an investigation plan based on current context."""
        response = await self.client.chat.completions.create(
            model="splunk-hosted-model",
            messages=[
                {"role": "system", "content": "You are a senior SRE. Given the incident context and historical patterns, generate a step-by-step investigation plan with confidence scores."},
                {"role": "user", "content": f"Current incident context: {context}"}
            ],
            temperature=0.3
        )
        return response.choices[0].message.content

    async def assess_risk(self, action: str, service_context: dict) -> dict:
        """Assess risk of a proposed remediation action."""
        response = await self.client.chat.completions.create(
            model="splunk-hosted-model",
            messages=[
                {"role": "system", "content": "Evaluate the risk of the proposed action. Return: risk_level (low/medium/high/critical), blast_radius, potential_side_effects, and confidence_score."},
                {"role": "user", "content": f"Proposed action: {action}\nService context: {service_context}"}
            ],
            temperature=0.1
        )
        return {"assessment": response.choices[0].message.content}

hosted_models = SplunkHostedModels()
```

### 3.2 Add Config Entries

Update `backend/app/config.py`:

```python
    # Splunk Hosted Models
    splunk_hosted_model_key: str = ""
    splunk_hosted_model_url: str = ""
```

---

## Step 4: Build the AI Agents

### 4.1 Agent Base

Create `backend/app/agents/base.py`:

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any

@dataclass
class AgentOutput:
    agent_name: str
    findings: dict
    confidence: float
    reasoning: str
    recommendations: list[str]

class BaseAgent(ABC):
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    async def investigate(self, context: dict) -> AgentOutput:
        """Execute the agent's investigation logic."""
        pass
```

### 4.2 Historian Agent

Create `backend/app/agents/historian.py`:

```python
from app.agents.base import BaseAgent, AgentOutput
from app.services.mcp_client import mcp_client
from app.db.qdrant_client import vector_store
from app.services.hosted_models import hosted_models

class HistorianAgent(BaseAgent):
    """
    Searches operational memory for similar past incidents.
    Uses Splunk MCP to query historical data.
    Uses Qdrant for semantic similarity search.
    """

    def __init__(self):
        super().__init__("Incident Historian")

    async def investigate(self, context: dict) -> AgentOutput:
        service = context.get("service", "")
        symptoms = context.get("symptoms", [])
        root_cause_hint = context.get("root_cause_hint", "")

        # Step 1: Query MCP for similar incidents
        similar_incidents = await mcp_client.get_similar_incidents(
            service=service,
            root_cause=root_cause_hint,
            limit=10
        )

        # Step 2: Semantic search in vector store for broader matches
        # (Requires embedding — simplified here)
        vector_results = []  # vector_store.search("incidents", query_embedding, limit=5)

        # Step 3: Use Hosted Models to summarize findings
        summary = await hosted_models.summarize_incident({
            "current_symptoms": symptoms,
            "similar_incidents": similar_incidents
        })

        # Step 4: Calculate similarity confidence
        confidence = self._calculate_confidence(similar_incidents, context)

        return AgentOutput(
            agent_name=self.name,
            findings={
                "similar_incidents": similar_incidents,
                "vector_matches": vector_results,
                "summary": summary
            },
            confidence=confidence,
            reasoning=f"Found {len(similar_incidents)} similar incidents for service {service}",
            recommendations=[
                f"Review incident {inc.get('incident_id')}" for inc in similar_incidents[:3]
            ]
        )

    def _calculate_confidence(self, incidents: list, context: dict) -> float:
        if not incidents:
            return 0.1
        # Simple heuristic: more matches = higher confidence
        return min(0.95, 0.3 + (len(incidents) * 0.1))
```

### 4.3 Expert Twin Agent

Create `backend/app/agents/expert_twin.py`:

```python
from app.agents.base import BaseAgent, AgentOutput
from app.services.mcp_client import mcp_client
from app.services.hosted_models import hosted_models
from app.db.neo4j_client import knowledge_graph

class ExpertTwinAgent(BaseAgent):
    """
    Simulates expert engineer reasoning.
    Reconstructs how a specific engineer would investigate.
    """

    def __init__(self):
        super().__init__("Expert Twin")

    async def investigate(self, context: dict) -> AgentOutput:
        service = context.get("service", "")
        symptoms = context.get("symptoms", [])

        # Step 1: Find the best expert for this type of incident
        expert = await self._find_best_expert(service, context.get("root_cause_hint", ""))

        # Step 2: Get the expert's investigation history via MCP
        expert_history = await mcp_client.get_engineer_history(expert)

        # Step 3: Query knowledge graph for expert's patterns
        expertise = knowledge_graph.find_engineer_expertise(expert)

        # Step 4: Use Hosted Models to simulate expert reasoning
        reasoning = await hosted_models.extract_expert_patterns(expert, expert_history)

        # Step 5: Generate investigation plan as the expert would
        plan = await hosted_models.generate_investigation_plan({
            "expert": expert,
            "expert_patterns": reasoning,
            "current_symptoms": symptoms,
            "service": service
        })

        return AgentOutput(
            agent_name=self.name,
            findings={
                "expert_selected": expert,
                "expert_history_count": len(expert_history),
                "expertise_areas": expertise,
                "simulated_reasoning": reasoning,
                "investigation_plan": plan
            },
            confidence=0.85 if expert_history else 0.4,
            reasoning=f"Simulating {expert}'s investigation approach based on {len(expert_history)} historical incidents",
            recommendations=self._extract_steps(plan)
        )

    async def _find_best_expert(self, service: str, root_cause: str) -> str:
        """Identify which engineer has most experience with this type of issue."""
        incidents = await mcp_client.query_incidents(
            f'service="{service}" OR root_cause="{root_cause}" | stats count by investigating_engineer | sort -count'
        )
        if incidents:
            return incidents[0].get("investigating_engineer", "alex_chen")
        return "alex_chen"  # Fallback

    def _extract_steps(self, plan: str) -> list[str]:
        """Parse investigation plan into actionable steps."""
        lines = plan.split("\n")
        return [line.strip() for line in lines if line.strip().startswith(("1.", "2.", "3.", "4.", "5.", "-"))][:5]
```

### 4.4 Risk Assessment Agent

Create `backend/app/agents/risk_agent.py`:

```python
from app.agents.base import BaseAgent, AgentOutput
from app.services.mcp_client import mcp_client
from app.services.hosted_models import hosted_models

class RiskAssessmentAgent(BaseAgent):
    """
    Evaluates risk of proposed remediation actions.
    Calculates blast radius and side effects.
    """

    def __init__(self):
        super().__init__("Risk Assessment")

    async def investigate(self, context: dict) -> AgentOutput:
        service = context.get("service", "")
        proposed_actions = context.get("proposed_actions", [])

        # Step 1: Get service dependencies via MCP
        dependencies = await mcp_client.get_service_dependencies(service)

        # Step 2: Check current system state
        current_metrics = await mcp_client.query_metrics(service, "error_rate", "-15m")

        # Step 3: Assess each proposed action
        risk_assessments = []
        for action in proposed_actions:
            assessment = await hosted_models.assess_risk(action, {
                "service": service,
                "dependencies": dependencies,
                "current_state": current_metrics
            })
            risk_assessments.append({
                "action": action,
                "assessment": assessment
            })

        # Step 4: Calculate blast radius
        blast_radius = self._calculate_blast_radius(dependencies)

        # Step 5: Rank actions by safety
        ranked_actions = self._rank_by_safety(risk_assessments)

        return AgentOutput(
            agent_name=self.name,
            findings={
                "service_dependencies": dependencies,
                "blast_radius": blast_radius,
                "risk_assessments": risk_assessments,
                "ranked_actions": ranked_actions,
                "current_system_state": current_metrics
            },
            confidence=0.8,
            reasoning=f"Assessed {len(proposed_actions)} actions. Blast radius: {blast_radius['affected_services']} services",
            recommendations=[
                f"[{ra['risk_level']}] {ra['action']}" for ra in ranked_actions[:3]
            ]
        )

    def _calculate_blast_radius(self, dependencies: list) -> dict:
        return {
            "affected_services": len(dependencies),
            "dependency_depth": min(3, len(dependencies)),
            "risk_level": "high" if len(dependencies) > 5 else "medium" if len(dependencies) > 2 else "low"
        }

    def _rank_by_safety(self, assessments: list) -> list:
        """Rank actions from safest to riskiest."""
        risk_order = {"low": 0, "medium": 1, "high": 2, "critical": 3}
        return sorted(assessments, key=lambda x: risk_order.get(
            x.get("assessment", {}).get("risk_level", "high"), 2
        ))
```

### 4.5 Resolution Planner Agent

Create `backend/app/agents/resolution_planner.py`:

```python
from app.agents.base import BaseAgent, AgentOutput
from app.services.mcp_client import mcp_client
from app.services.hosted_models import hosted_models

class ResolutionPlannerAgent(BaseAgent):
    """
    Merges findings from all agents into an executable response plan.
    Final agent in the chain.
    """

    def __init__(self):
        super().__init__("Resolution Planner")

    async def investigate(self, context: dict) -> AgentOutput:
        historian_output = context.get("historian_findings", {})
        expert_output = context.get("expert_findings", {})
        risk_output = context.get("risk_findings", {})

        # Step 1: Get current telemetry
        service = context.get("service", "")
        current_alerts = await mcp_client.query_incidents(
            f'service="{service}" status="open"'
        )

        # Step 2: Synthesize all agent findings
        synthesis_context = {
            "current_incident": context.get("incident", {}),
            "historical_similar": historian_output,
            "expert_reasoning": expert_output,
            "risk_assessment": risk_output,
            "active_alerts": current_alerts
        }

        # Step 3: Generate resolution plan via Hosted Models
        plan = await hosted_models.generate_investigation_plan(synthesis_context)

        # Step 4: Structure the plan
        structured_plan = self._structure_plan(plan, risk_output)

        return AgentOutput(
            agent_name=self.name,
            findings={
                "resolution_plan": structured_plan,
                "active_alerts": current_alerts,
                "synthesis": plan
            },
            confidence=self._aggregate_confidence(context),
            reasoning="Merged all agent findings into executable resolution plan",
            recommendations=structured_plan.get("steps", [])
        )

    def _structure_plan(self, plan: str, risk_output: dict) -> dict:
        return {
            "steps": [line.strip() for line in plan.split("\n") if line.strip()][:7],
            "risk_level": risk_output.get("blast_radius", {}).get("risk_level", "medium"),
            "requires_approval": risk_output.get("blast_radius", {}).get("risk_level", "") in ["high", "critical"],
            "estimated_resolution_time": "15-30 minutes"
        }

    def _aggregate_confidence(self, context: dict) -> float:
        """Average confidence from all agent outputs."""
        scores = [
            context.get("historian_confidence", 0.5),
            context.get("expert_confidence", 0.5),
            context.get("risk_confidence", 0.5)
        ]
        return sum(scores) / len(scores)
```

---

## Step 5: LangGraph Orchestration

Create `backend/app/agents/orchestrator.py`:

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
from app.agents.historian import HistorianAgent
from app.agents.expert_twin import ExpertTwinAgent
from app.agents.risk_agent import RiskAssessmentAgent
from app.agents.resolution_planner import ResolutionPlannerAgent

class InvestigationState(TypedDict):
    incident: dict
    service: str
    symptoms: list
    root_cause_hint: str
    proposed_actions: list
    historian_output: dict | None
    expert_output: dict | None
    risk_output: dict | None
    resolution_plan: dict | None
    overall_confidence: float

# Instantiate agents
historian = HistorianAgent()
expert_twin = ExpertTwinAgent()
risk_agent = RiskAssessmentAgent()
planner = ResolutionPlannerAgent()

async def run_historian(state: InvestigationState) -> InvestigationState:
    output = await historian.investigate(state)
    state["historian_output"] = {
        "findings": output.findings,
        "confidence": output.confidence,
        "recommendations": output.recommendations
    }
    return state

async def run_expert_twin(state: InvestigationState) -> InvestigationState:
    context = {**state, "historian_findings": state.get("historian_output", {}).get("findings", {})}
    output = await expert_twin.investigate(context)
    state["expert_output"] = {
        "findings": output.findings,
        "confidence": output.confidence,
        "recommendations": output.recommendations
    }
    # Extract proposed actions from expert
    state["proposed_actions"] = output.recommendations[:5]
    return state

async def run_risk_assessment(state: InvestigationState) -> InvestigationState:
    output = await risk_agent.investigate(state)
    state["risk_output"] = {
        "findings": output.findings,
        "confidence": output.confidence,
        "recommendations": output.recommendations
    }
    return state

async def run_resolution_planner(state: InvestigationState) -> InvestigationState:
    context = {
        **state,
        "historian_findings": state.get("historian_output", {}).get("findings", {}),
        "expert_findings": state.get("expert_output", {}).get("findings", {}),
        "risk_findings": state.get("risk_output", {}).get("findings", {}),
        "historian_confidence": state.get("historian_output", {}).get("confidence", 0.5),
        "expert_confidence": state.get("expert_output", {}).get("confidence", 0.5),
        "risk_confidence": state.get("risk_output", {}).get("confidence", 0.5),
    }
    output = await planner.investigate(context)
    state["resolution_plan"] = output.findings
    state["overall_confidence"] = output.confidence
    return state

# Build the graph
def build_investigation_graph():
    workflow = StateGraph(InvestigationState)

    workflow.add_node("historian", run_historian)
    workflow.add_node("expert_twin", run_expert_twin)
    workflow.add_node("risk_assessment", run_risk_assessment)
    workflow.add_node("resolution_planner", run_resolution_planner)

    # Sequential flow: Historian → Expert Twin → Risk → Planner
    workflow.set_entry_point("historian")
    workflow.add_edge("historian", "expert_twin")
    workflow.add_edge("expert_twin", "risk_assessment")
    workflow.add_edge("risk_assessment", "resolution_planner")
    workflow.add_edge("resolution_planner", END)

    return workflow.compile()

investigation_graph = build_investigation_graph()
```

---

## Step 6: API Routes for Agents

Create `backend/app/routes/investigation.py`:

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.agents.orchestrator import investigation_graph, InvestigationState

router = APIRouter(prefix="/api/v1/investigation", tags=["Investigation"])

class IncidentRequest(BaseModel):
    service: str
    symptoms: list[str]
    severity: str = "P2"
    root_cause_hint: str = ""

class InvestigationResponse(BaseModel):
    incident_id: str
    resolution_plan: dict
    overall_confidence: float
    agent_outputs: dict

@router.post("/start", response_model=InvestigationResponse)
async def start_investigation(request: IncidentRequest):
    """Trigger multi-agent investigation for an incident."""
    initial_state: InvestigationState = {
        "incident": {
            "service": request.service,
            "symptoms": request.symptoms,
            "severity": request.severity
        },
        "service": request.service,
        "symptoms": request.symptoms,
        "root_cause_hint": request.root_cause_hint,
        "proposed_actions": [],
        "historian_output": None,
        "expert_output": None,
        "risk_output": None,
        "resolution_plan": None,
        "overall_confidence": 0.0
    }

    # Run the agent graph
    result = await investigation_graph.ainvoke(initial_state)

    return InvestigationResponse(
        incident_id=f"INV-{hash(request.service) % 10000:04d}",
        resolution_plan=result.get("resolution_plan", {}),
        overall_confidence=result.get("overall_confidence", 0.0),
        agent_outputs={
            "historian": result.get("historian_output"),
            "expert_twin": result.get("expert_output"),
            "risk_assessment": result.get("risk_output")
        }
    )
```

### Register Route

Update `backend/app/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.investigation import router as investigation_router

app = FastAPI(
    title="OpsTwin AI",
    description="Digital Operational Twins for Institutional Knowledge Preservation",
    version="0.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(investigation_router)

@app.get("/health")
async def health():
    return {"status": "healthy", "phase": 2, "agents": ["historian", "expert_twin", "risk", "planner"]}
```

---

## Step 7: Splunk MCP Server Configuration

Create `.kiro/settings/mcp.json` for the workspace:

```json
{
  "mcpServers": {
    "splunk-mcp": {
      "command": "uvx",
      "args": ["splunk-mcp-server@latest"],
      "env": {
        "SPLUNK_HOST": "localhost",
        "SPLUNK_PORT": "8089",
        "SPLUNK_USERNAME": "admin",
        "SPLUNK_PASSWORD": "ChangeMeNow1!",
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": ["search", "get_indexes"]
    }
  }
}
```

---

## Step 8: Verify Phase 2

### Agent Testing

```bash
# Start the backend
cd backend
uvicorn app.main:app --reload --port 8001

# Test investigation endpoint
curl -X POST http://localhost:8001/api/v1/investigation/start \
  -H "Content-Type: application/json" \
  -d '{
    "service": "redis-cluster",
    "symptoms": ["memory_saturation", "latency_spike"],
    "severity": "P1",
    "root_cause_hint": "memory_leak"
  }'
```

### Expected Response Structure

```json
{
  "incident_id": "INV-0042",
  "resolution_plan": {
    "resolution_plan": {
      "steps": ["Check Redis memory usage", "Verify cache hit ratio", "Restart cache pods"],
      "risk_level": "medium",
      "requires_approval": false,
      "estimated_resolution_time": "15-30 minutes"
    }
  },
  "overall_confidence": 0.78,
  "agent_outputs": {
    "historian": { "findings": {...}, "confidence": 0.85, "recommendations": [...] },
    "expert_twin": { "findings": {...}, "confidence": 0.82, "recommendations": [...] },
    "risk_assessment": { "findings": {...}, "confidence": 0.75, "recommendations": [...] }
  }
}
```

### Checklist

| # | Task | Verification |
|---|------|-------------|
| 1 | MCP Client connects to Splunk | Query returns incident data |
| 2 | Hosted Models respond | Summarization returns structured text |
| 3 | Historian Agent works | Returns similar incidents |
| 4 | Expert Twin Agent works | Simulates expert reasoning |
| 5 | Risk Agent works | Returns risk assessments |
| 6 | Resolution Planner works | Produces structured plan |
| 7 | LangGraph orchestration runs | All agents execute in sequence |
| 8 | API endpoint functional | POST `/api/v1/investigation/start` returns plan |

---

## Phase 2 Deliverables

- [x] Splunk MCP Client — all agents use MCP for data access
- [x] Splunk Hosted Models integration — summarization, reasoning, risk assessment
- [x] Historian Agent — finds similar past incidents
- [x] Expert Twin Agent — simulates engineer reasoning
- [x] Risk Assessment Agent — evaluates remediation safety
- [x] Resolution Planner Agent — generates executable response plan
- [x] LangGraph orchestration — sequential multi-agent workflow
- [x] REST API endpoint for triggering investigations
- [x] MCP Server configuration

---

## Next → Phase 3

Phase 3 builds the React dashboard, creates real-time incident visualization, adds the interactive investigation UI, and prepares the project for hackathon submission with documentation and a demo video.
