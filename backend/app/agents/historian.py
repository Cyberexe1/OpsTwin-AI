from app.agents.base import BaseAgent, AgentOutput
from app.services.mcp_client import splunk_mcp
from app.services.llm import llm_service


class HistorianAgent(BaseAgent):
    """
    Searches Splunk for historically similar incidents.
    Uses the Splunk MCP Server as the data access layer.
    """

    def __init__(self):
        super().__init__("Incident Historian")

    async def investigate(self, context: dict) -> AgentOutput:
        service = context.get("service", "")
        symptoms = context.get("symptoms", [])
        root_cause_hint = context.get("root_cause_hint", "")

        # Step 1: Query Splunk via MCP Server for similar incidents
        query_parts = [f'index=opstwin_incidents sourcetype="opstwin:incident"']
        if service:
            query_parts.append(f'service="{service}"')
        if root_cause_hint:
            query_parts.append(f'root_cause="{root_cause_hint}"')

        query = " ".join(query_parts) + " | head 10 | table incident_id, service, root_cause, investigating_engineer, mttr_minutes, resolution"

        similar_incidents = await splunk_mcp.search(query, earliest="-365d")

        # Step 2: If no exact match, broaden search
        if not similar_incidents and service:
            broad_query = f'index=opstwin_incidents sourcetype="opstwin:incident" service="{service}" | head 5 | table incident_id, service, root_cause, investigating_engineer, mttr_minutes'
            similar_incidents = await splunk_mcp.search(broad_query, earliest="-365d")

        # Step 3: Splunk ML — predict root cause + detect anomalies
        from app.services.splunk_ml import splunk_ml
        root_cause_prediction = await splunk_ml.predict_root_cause(service, context.get("severity", "P2"))
        anomaly_data = await splunk_ml.detect_anomaly(service)
        mttr_estimate = await splunk_ml.estimate_resolution_time(
            service, root_cause_hint or (root_cause_prediction["predictions"][0]["root_cause"] if root_cause_prediction["predictions"] else "")
        )

        # Step 4: Use LLM to summarize findings
        summary = await llm_service.summarize_incidents(
            service=service,
            symptoms=symptoms,
            incidents=similar_incidents,
        )

        # Step 5: Calculate confidence
        confidence = self._calculate_confidence(similar_incidents, service)

        return AgentOutput(
            agent_name=self.name,
            confidence=confidence,
            findings={
                "similar_incidents": similar_incidents[:5],
                "total_matches": len(similar_incidents),
                "summary": summary,
                "splunk_ml": {
                    "root_cause_prediction": root_cause_prediction,
                    "anomaly_detection": anomaly_data,
                    "mttr_estimate": mttr_estimate,
                },
            },
            reasoning=f"Found {len(similar_incidents)} similar incidents for service '{service}'. Splunk ML predicts root cause and estimates MTTR.",
            recommendations=self._generate_recommendations(similar_incidents),
        )

    def _calculate_confidence(self, incidents: list, service: str) -> float:
        if not incidents:
            return 0.3
        count = len(incidents)
        base = 0.5
        bonus = min(0.45, count * 0.05)
        return round(base + bonus, 2)

    def _generate_recommendations(self, incidents: list) -> list[str]:
        if not incidents:
            return ["No similar incidents found — manual investigation recommended"]

        recs = []
        for inc in incidents[:3]:
            inc_id = inc.get("incident_id", "unknown")
            resolution = inc.get("resolution", "N/A")
            recs.append(f"Review {inc_id}: {resolution}")
        return recs


historian_agent = HistorianAgent()
