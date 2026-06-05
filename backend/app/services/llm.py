from openai import AsyncOpenAI
from app.config import settings


class LLMService:
    """
    LLM interface for all agent reasoning tasks.
    Uses OpenAI API (or compatible endpoint for Splunk Hosted Models).
    Falls back to template responses if no API key is configured.
    """

    def __init__(self):
        self.client = None
        if settings.openai_api_key:
            self.client = AsyncOpenAI(
                api_key=settings.openai_api_key,
                base_url=settings.openai_base_url,
            )
        self.model = settings.openai_model

    async def _chat(self, system: str, user: str) -> str:
        """Send a chat completion request. Falls back to template if no key."""
        if not self.client:
            return self._fallback_response(system, user)

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                temperature=0.3,
                max_tokens=500,
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"[LLM Error: {str(e)}] — Using fallback reasoning."

    async def summarize_incidents(self, service: str, symptoms: list, incidents: list) -> str:
        system = "You are a senior SRE analyzing incident patterns. Summarize the findings concisely."
        user = f"""Service: {service}
Current symptoms: {', '.join(symptoms)}
Similar historical incidents found: {len(incidents)}
Incidents: {incidents[:3]}

Provide a brief summary of patterns and what they suggest about the current issue."""

        return await self._chat(system, user)

    async def simulate_expert_reasoning(self, expert: str, service: str, symptoms: list, history: list, similar_incidents: list) -> str:
        system = f"""You are simulating the reasoning process of expert engineer '{expert}'. 
Based on their historical investigation patterns, describe how they would investigate this incident step by step.
Be specific and technical. Format as numbered steps."""

        user = f"""Current incident:
- Service: {service}
- Symptoms: {', '.join(symptoms)}
- Expert's past incidents: {len(history)} similar cases resolved

Past investigation patterns from {expert}:
{history[:3]}

Generate the investigation steps {expert} would take."""

        return await self._chat(system, user)

    async def assess_risk(self, service: str, proposed_actions: list, related_services: list, recent_errors: list) -> str:
        system = "You are a risk assessment specialist. Evaluate each proposed action for safety and blast radius. Be concise."
        user = f"""Service under investigation: {service}
Related services that could be affected: {[s.get('service', '') for s in related_services[:5]]}
Recent P1/P2 incidents: {len(recent_errors)}

Proposed remediation actions:
{chr(10).join(f'- {a}' for a in proposed_actions[:5])}

For each action, assess: risk level (low/medium/high), potential side effects, and estimated impact duration."""

        return await self._chat(system, user)

    async def generate_resolution_plan(self, service: str, symptoms: list, historian: dict, expert: dict, risk: dict) -> str:
        system = """You are the Resolution Planner agent. Synthesize all investigation findings into a clear, executable resolution plan.
Format as numbered steps. Include verification checks after critical actions."""

        user = f"""Incident Summary:
- Service: {service}
- Symptoms: {', '.join(symptoms)}

Historian findings: {historian.get('summary', 'N/A')}
Expert reasoning: {expert.get('simulated_reasoning', 'N/A')[:300]}
Risk level: {risk.get('blast_radius', {}).get('risk_level', 'medium')}
Affected services: {risk.get('blast_radius', {}).get('affected_count', 0)}

Generate a step-by-step resolution plan (5-7 steps)."""

        return await self._chat(system, user)

    def _fallback_response(self, system: str, user: str) -> str:
        """Template responses when no LLM API key is configured."""
        if "summarize" in system.lower() or "pattern" in system.lower():
            return "Analysis of historical incidents reveals recurring patterns related to memory pressure and connection pool exhaustion. The most common resolution involves service restart followed by configuration adjustment."

        if "expert" in system.lower() or "reasoning" in system.lower():
            return """1. Check service health dashboard for anomaly correlation
2. Query Splunk logs for error spike patterns (index=opstwin_incidents)
3. Verify resource limits (memory, CPU, connections)
4. Check recent deployments for regression
5. Apply targeted fix based on root cause identification"""

        if "risk" in system.lower():
            return """1. [LOW RISK] Restart affected pods — 30s downtime, auto-recovery
2. [MEDIUM RISK] Flush cache namespace — cold cache for 2-3 min
3. [LOW RISK] Scale horizontally — no downtime, increased cost
4. [HIGH RISK] Rollback deployment — affects all users, 5 min"""

        if "resolution" in system.lower() or "plan" in system.lower():
            return """1. Isolate affected node from load balancer
2. Verify root cause via Splunk query correlation
3. Apply targeted fix (restart/flush/rollback based on findings)
4. Verify fix via health check endpoint
5. Restore traffic gradually (canary pattern)
6. Monitor for 10 minutes post-fix
7. Close incident and update knowledge base"""

        return "Investigation proceeding based on standard operational procedure."


llm_service = LLMService()
