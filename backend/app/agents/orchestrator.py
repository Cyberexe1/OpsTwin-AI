"""
Multi-agent orchestration using LangGraph.
Chains: Historian → Expert Twin → Risk Assessment → Resolution Planner
"""

from typing import TypedDict
from langgraph.graph import StateGraph, END

from app.agents.historian import historian_agent
from app.agents.expert_twin import expert_twin_agent
from app.agents.risk_agent import risk_agent
from app.agents.resolution_planner import resolution_planner


class InvestigationState(TypedDict):
    # Input
    service: str
    symptoms: list
    severity: str
    root_cause_hint: str
    # Agent outputs
    historian_output: dict | None
    expert_output: dict | None
    risk_output: dict | None
    resolution_output: dict | None
    # Aggregated
    overall_confidence: float
    status: str


async def run_historian(state: InvestigationState) -> InvestigationState:
    """Stage 1: Search operational memory for similar incidents."""
    output = await historian_agent.investigate({
        "service": state["service"],
        "symptoms": state["symptoms"],
        "root_cause_hint": state["root_cause_hint"],
    })
    state["historian_output"] = {
        "agent_name": output.agent_name,
        "confidence": output.confidence,
        "findings": output.findings,
        "reasoning": output.reasoning,
        "recommendations": output.recommendations,
    }
    return state


async def run_expert_twin(state: InvestigationState) -> InvestigationState:
    """Stage 2: Simulate expert engineer reasoning."""
    output = await expert_twin_agent.investigate({
        "service": state["service"],
        "symptoms": state["symptoms"],
        "historian_findings": state["historian_output"].get("findings", {}) if state["historian_output"] else {},
    })
    state["expert_output"] = {
        "agent_name": output.agent_name,
        "confidence": output.confidence,
        "findings": output.findings,
        "reasoning": output.reasoning,
        "recommendations": output.recommendations,
    }
    return state


async def run_risk_assessment(state: InvestigationState) -> InvestigationState:
    """Stage 3: Evaluate remediation risk and blast radius."""
    expert_recs = []
    if state["expert_output"]:
        expert_recs = state["expert_output"].get("recommendations", [])

    output = await risk_agent.investigate({
        "service": state["service"],
        "symptoms": state["symptoms"],
        "proposed_actions": expert_recs,
        "expert_findings": state["expert_output"].get("findings", {}) if state["expert_output"] else {},
    })
    state["risk_output"] = {
        "agent_name": output.agent_name,
        "confidence": output.confidence,
        "findings": output.findings,
        "reasoning": output.reasoning,
        "recommendations": output.recommendations,
    }
    return state


async def run_resolution_planner(state: InvestigationState) -> InvestigationState:
    """Stage 4: Generate executable resolution plan."""
    output = await resolution_planner.investigate({
        "service": state["service"],
        "symptoms": state["symptoms"],
        "historian_findings": state["historian_output"].get("findings", {}) if state["historian_output"] else {},
        "expert_findings": state["expert_output"].get("findings", {}) if state["expert_output"] else {},
        "risk_findings": state["risk_output"].get("findings", {}) if state["risk_output"] else {},
        "historian_confidence": state["historian_output"].get("confidence", 0.5) if state["historian_output"] else 0.5,
        "expert_confidence": state["expert_output"].get("confidence", 0.5) if state["expert_output"] else 0.5,
        "risk_confidence": state["risk_output"].get("confidence", 0.5) if state["risk_output"] else 0.5,
    })
    state["resolution_output"] = {
        "agent_name": output.agent_name,
        "confidence": output.confidence,
        "findings": output.findings,
        "reasoning": output.reasoning,
        "recommendations": output.recommendations,
    }
    state["overall_confidence"] = output.confidence
    state["status"] = "completed"
    return state


def build_investigation_graph():
    """Build the LangGraph workflow: Historian → Expert → Risk → Planner."""
    workflow = StateGraph(InvestigationState)

    workflow.add_node("historian", run_historian)
    workflow.add_node("expert_twin", run_expert_twin)
    workflow.add_node("risk_assessment", run_risk_assessment)
    workflow.add_node("resolution_planner", run_resolution_planner)

    workflow.set_entry_point("historian")
    workflow.add_edge("historian", "expert_twin")
    workflow.add_edge("expert_twin", "risk_assessment")
    workflow.add_edge("risk_assessment", "resolution_planner")
    workflow.add_edge("resolution_planner", END)

    return workflow.compile()


# Compiled graph — ready to invoke
investigation_graph = build_investigation_graph()
