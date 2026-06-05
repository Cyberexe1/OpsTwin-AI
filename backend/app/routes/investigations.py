from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1", tags=["Investigations"])


class InvestigationRequest(BaseModel):
    service: str
    symptoms: list[str]
    severity: str = "P2"
    root_cause_hint: str = ""


class AgentOutput(BaseModel):
    agent_name: str
    confidence: float
    findings: dict
    recommendations: list[str]


class InvestigationResponse(BaseModel):
    incident_id: str
    status: str
    overall_confidence: float
    resolution_plan: dict
    agent_outputs: dict


# Mock data for demo — will be replaced by real agent orchestration in Phase 2
MOCK_AGENTS = {
    "historian": AgentOutput(
        agent_name="Incident Historian",
        confidence=0.92,
        findings={
            "similar_incidents": [
                {"id": "INC-0142", "service": "redis-cluster", "similarity": 0.92},
                {"id": "INC-0089", "service": "redis-cluster", "similarity": 0.85},
                {"id": "INC-0201", "service": "api-gateway", "similarity": 0.71},
            ],
            "summary": "Found 3 similar incidents involving Redis memory pressure with API latency correlation.",
        },
        recommendations=[
            "Review INC-0142 resolution (Redis cache flush + pod restart)",
            "Check deployment history for recent memory limit changes",
            "Verify Redis maxmemory-policy configuration",
        ],
    ),
    "expert_twin": AgentOutput(
        agent_name="Expert Twin (Alex Chen)",
        confidence=0.87,
        findings={
            "expert_selected": "alex_chen",
            "reasoning": "Alex investigated Redis memory issues first in 87% of similar cases. His pattern: check memory fragmentation ratio → verify eviction policy → inspect slow queries → restart if needed.",
            "investigation_steps": [
                "redis-cli INFO memory → check mem_fragmentation_ratio",
                "redis-cli CONFIG GET maxmemory-policy",
                "redis-cli SLOWLOG GET 10",
                "kubectl rollout restart deployment/redis-cache",
            ],
        },
        recommendations=[
            "Check mem_fragmentation_ratio (should be < 1.5)",
            "Verify eviction policy is allkeys-lru",
            "Inspect slow queries from last 30 minutes",
        ],
    ),
    "risk_assessment": AgentOutput(
        agent_name="Risk Assessment",
        confidence=0.80,
        findings={
            "blast_radius": {
                "affected_services": 3,
                "services": ["api-gateway", "user-service", "billing-engine"],
                "risk_level": "medium",
            },
            "action_risks": [
                {"action": "Restart Redis pods", "risk": "low", "downtime": "~30s"},
                {"action": "Flush cache namespace", "risk": "medium", "impact": "Cold cache for 2-3 min"},
                {"action": "Scale horizontally", "risk": "low", "cost": "+$12/hr"},
            ],
        },
        recommendations=[
            "[LOW RISK] Restart Redis pods (30s downtime)",
            "[MED RISK] Flush auth:session:cache namespace",
            "[LOW RISK] Add 2 Redis replicas temporarily",
        ],
    ),
}


@router.post("/investigation/start", response_model=InvestigationResponse)
async def start_investigation(request: InvestigationRequest):
    """Trigger a multi-agent investigation (returns mock data in Phase 1)."""
    incident_id = f"INV-{abs(hash(request.service)) % 10000:04d}"

    resolution_plan = {
        "title": "Resolution Plan: Alpha-7",
        "confidence": 0.94,
        "risk_level": "medium",
        "requires_approval": False,
        "estimated_time": "15-30 minutes",
        "steps": [
            "Verify Redis memory usage (redis-cli INFO memory)",
            "Check cache hit ratio — if below 60%, flush namespace",
            "Restart Redis cache pods (kubectl rollout restart)",
            "Monitor latency for 5 minutes post-restart",
            "Escalate to on-call if P99 latency > 200ms after 10 min",
        ],
    }

    return InvestigationResponse(
        incident_id=incident_id,
        status="completed",
        overall_confidence=0.86,
        resolution_plan=resolution_plan,
        agent_outputs={
            "historian": MOCK_AGENTS["historian"].model_dump(),
            "expert_twin": MOCK_AGENTS["expert_twin"].model_dump(),
            "risk_assessment": MOCK_AGENTS["risk_assessment"].model_dump(),
        },
    )


@router.get("/investigations")
async def list_investigations():
    """List recent investigations (mock data)."""
    return {
        "total": 5,
        "investigations": [
            {"id": "INV-8842", "service": "auth-gateway-v2", "severity": "P1", "confidence": 0.94, "status": "resolved", "duration": "12m 45s", "time": "2m ago"},
            {"id": "INV-8840", "service": "payment-processor", "severity": "P2", "confidence": 0.81, "status": "analyzing", "duration": "3h 12m", "time": "14m ago"},
            {"id": "INV-8838", "service": "redis-cache-main", "severity": "P3", "confidence": 0.99, "status": "resolved", "duration": "5m 12s", "time": "1h ago"},
            {"id": "INV-8837", "service": "kubernetes-node-04", "severity": "P2", "confidence": 0.74, "status": "resolved", "duration": "45m 22s", "time": "2h ago"},
            {"id": "INV-8835", "service": "search-indexer", "severity": "P3", "confidence": 0.96, "status": "resolved", "duration": "8m 10s", "time": "4h ago"},
        ],
    }


@router.get("/analytics/summary")
async def analytics_summary():
    """Dashboard analytics summary (mock data)."""
    return {
        "mttr_reduction": -47,
        "knowledge_preserved": 500,
        "expert_twins": 4,
        "avg_confidence": 87,
        "agents": {
            "historian": {"executions": 842, "avg_confidence": 94.2, "success_rate": 99.1},
            "expert_twin": {"executions": 512, "avg_confidence": 88.5, "success_rate": 96.4},
            "risk_agent": {"executions": 219, "avg_confidence": 72.1, "success_rate": 88.9},
            "planner": {"executions": 690, "avg_confidence": 91.0, "success_rate": 97.2},
        },
    }
