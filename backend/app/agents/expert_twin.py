from app.agents.base import BaseAgent, AgentOutput
from app.services.mcp_client import splunk_mcp
from app.services.llm import llm_service


class ExpertTwinAgent(BaseAgent):
    """
    Simulates expert engineer reasoning by analyzing their historical
    investigation patterns from Splunk data via MCP Server.
    """

    def __init__(self):
        super().__init__("Expert Twin")

    async def investigate(self, context: dict) -> AgentOutput:
        service = context.get("service", "")
        symptoms = context.get("symptoms", [])
        historian_findings = context.get("historian_findings", {})

        # Step 1: Find the best expert for this type of incident
        expert = await self._find_best_expert(service)

        # Step 2: Get the expert's investigation history from Splunk
        expert_history = await self._get_expert_history(expert)

        # Step 3: Use LLM to simulate expert reasoning
        reasoning = await llm_service.simulate_expert_reasoning(
            expert=expert,
            service=service,
            symptoms=symptoms,
            history=expert_history,
            similar_incidents=historian_findings.get("similar_incidents", []),
        )

        # Step 4: Generate investigation plan as the expert would
        confidence = 0.85 if expert_history else 0.5

        return AgentOutput(
            agent_name=self.name,
            confidence=confidence,
            findings={
                "expert_selected": expert,
                "history_count": len(expert_history),
                "simulated_reasoning": reasoning,
            },
            reasoning=f"Simulating {expert}'s investigation approach based on {len(expert_history)} historical incidents.",
            recommendations=self._extract_steps(reasoning),
        )

    async def _find_best_expert(self, service: str) -> str:
        """Find which engineer has most experience with this service."""
        query = f'index=opstwin_incidents sourcetype="opstwin:incident" service="{service}" | stats count by investigating_engineer | sort -count | head 1'
        results = await splunk_mcp.search(query, earliest="-365d")

        if results:
            return results[0].get("investigating_engineer", "alex_chen")
        return "alex_chen"  # fallback to most experienced

    async def _get_expert_history(self, engineer: str) -> list:
        """Retrieve an engineer's past investigations from Splunk."""
        query = f'index=opstwin_incidents sourcetype="opstwin:incident" investigating_engineer="{engineer}" | table incident_id, service, root_cause, investigation_steps, mttr_minutes | head 10'
        return await splunk_mcp.search(query, earliest="-365d")

    def _extract_steps(self, reasoning: str) -> list[str]:
        """Parse LLM reasoning into actionable steps."""
        lines = reasoning.split("\n")
        steps = [
            line.strip().lstrip("- ").lstrip("• ")
            for line in lines
            if line.strip() and any(line.strip().startswith(p) for p in ("1", "2", "3", "4", "5", "-", "•", "*"))
        ]
        return steps[:5] if steps else ["Follow standard investigation procedure"]


expert_twin_agent = ExpertTwinAgent()
