from app.agents.base import BaseAgent, AgentOutput
from app.services.llm import llm_service


class ResolutionPlannerAgent(BaseAgent):
    """
    Merges findings from all agents into an executable response plan.
    Final agent in the investigation chain.
    """

    def __init__(self):
        super().__init__("Resolution Planner")

    async def investigate(self, context: dict) -> AgentOutput:
        service = context.get("service", "")
        symptoms = context.get("symptoms", [])
        historian_findings = context.get("historian_findings", {})
        expert_findings = context.get("expert_findings", {})
        risk_findings = context.get("risk_findings", {})

        # Use LLM to synthesize all agent outputs into a plan
        plan = await llm_service.generate_resolution_plan(
            service=service,
            symptoms=symptoms,
            historian=historian_findings,
            expert=expert_findings,
            risk=risk_findings,
        )

        # Calculate aggregate confidence
        confidence = self._aggregate_confidence(context)

        # Structure the plan
        structured_plan = self._structure_plan(plan, risk_findings)

        return AgentOutput(
            agent_name=self.name,
            confidence=confidence,
            findings={
                "resolution_plan": structured_plan,
                "synthesis": plan,
            },
            reasoning="Merged all agent findings into executable resolution plan.",
            recommendations=structured_plan.get("steps", []),
        )

    def _aggregate_confidence(self, context: dict) -> float:
        scores = [
            context.get("historian_confidence", 0.5),
            context.get("expert_confidence", 0.5),
            context.get("risk_confidence", 0.5),
        ]
        return round(sum(scores) / len(scores), 2)

    def _structure_plan(self, plan: str, risk_findings: dict) -> dict:
        lines = [line.strip() for line in plan.split("\n") if line.strip()]
        steps = [l for l in lines if l[0:1].isdigit() or l.startswith("-") or l.startswith("•")][:7]

        risk_level = risk_findings.get("blast_radius", {}).get("risk_level", "medium")

        return {
            "steps": steps if steps else lines[:5],
            "risk_level": risk_level,
            "requires_approval": risk_level in ("high", "critical"),
            "estimated_time": "15-30 minutes",
        }


resolution_planner = ResolutionPlannerAgent()
