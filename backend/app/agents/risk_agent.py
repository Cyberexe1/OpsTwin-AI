from app.agents.base import BaseAgent, AgentOutput
from app.services.mcp_client import splunk_mcp
from app.services.llm import llm_service


class RiskAssessmentAgent(BaseAgent):
    """
    Evaluates the risk of proposed remediation actions.
    Calculates blast radius using Splunk service dependency data via MCP Server.
    """

    def __init__(self):
        super().__init__("Risk Assessment")

    async def investigate(self, context: dict) -> AgentOutput:
        service = context.get("service", "")
        proposed_actions = context.get("proposed_actions", [])
        expert_findings = context.get("expert_findings", {})

        # Step 1: Get service incident frequency from Splunk
        related_services = await self._get_related_services(service)

        # Step 2: Get current error rate context
        recent_errors = await self._get_recent_errors(service)

        # Step 3: Use LLM to assess risk of proposed actions
        risk_assessment = await llm_service.assess_risk(
            service=service,
            proposed_actions=proposed_actions or expert_findings.get("recommendations", []),
            related_services=related_services,
            recent_errors=recent_errors,
        )

        # Step 4: Calculate blast radius
        blast_radius = self._calculate_blast_radius(related_services)

        return AgentOutput(
            agent_name=self.name,
            confidence=0.80,
            findings={
                "blast_radius": blast_radius,
                "related_services": related_services,
                "risk_assessment": risk_assessment,
                "recent_error_count": len(recent_errors),
            },
            reasoning=f"Assessed risk for {service}. Blast radius: {blast_radius['affected_count']} services.",
            recommendations=self._rank_actions(risk_assessment),
        )

    async def _get_related_services(self, service: str) -> list:
        """Find services that commonly fail together."""
        query = f'index=opstwin_incidents sourcetype="opstwin:incident" | stats count by service | sort -count | head 8'
        return await splunk_mcp.search(query, earliest="-90d")

    async def _get_recent_errors(self, service: str) -> list:
        """Check recent incidents for this service."""
        query = f'index=opstwin_incidents sourcetype="opstwin:incident" service="{service}" severity="P1" OR severity="P2" | head 5 | table incident_id, severity, root_cause, mttr_minutes'
        return await splunk_mcp.search(query, earliest="-7d")

    def _calculate_blast_radius(self, related_services: list) -> dict:
        count = len(related_services)
        if count > 5:
            level = "high"
        elif count > 2:
            level = "medium"
        else:
            level = "low"

        return {
            "affected_count": count,
            "risk_level": level,
            "services": [s.get("service", "") for s in related_services[:5]],
        }

    def _rank_actions(self, assessment: str) -> list[str]:
        """Extract risk-ranked actions from LLM output."""
        lines = assessment.split("\n")
        actions = [line.strip() for line in lines if line.strip() and ("risk" in line.lower() or line.strip()[0].isdigit())]
        return actions[:5] if actions else ["Proceed with caution — manual review recommended"]


risk_agent = RiskAssessmentAgent()
