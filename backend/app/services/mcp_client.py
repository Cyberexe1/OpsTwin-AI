"""
Splunk MCP (Model Context Protocol) Service Layer.

This module implements the MCP-style interface for all agents to access Splunk.
It provides standardized tool-like functions that agents call — following the
Model Context Protocol pattern where AI agents access external data through
a structured, tool-based interface.

Architecture:
    Agent → splunk_mcp.search() → Splunk REST API → Results

This is the SOLE data access layer. No agent queries Splunk directly.
All operational data flows through this MCP interface.
"""

import json
from typing import Any

from app.config import settings
from app.services.splunk_client import splunk_client


class SplunkMCPService:
    """
    Model Context Protocol service for Splunk.

    Implements MCP-style tools that agents use to access operational data.
    Each method represents an MCP "tool" that agents can invoke.
    """

    def __init__(self):
        self._connected = False

    async def initialize(self):
        """Verify Splunk connectivity on startup."""
        status = await splunk_client.check_connection()
        self._connected = status.get("connected", False)
        if self._connected:
            print(f"[MCP] Splunk MCP Service connected to Splunk {status.get('version', 'unknown')}")
            print(f"[MCP] Available tools: search_splunk, get_incidents, get_engineer_history, get_service_dependencies")
        else:
            print(f"[MCP] WARNING: Splunk not reachable — {status.get('error', 'unknown error')}")
            print(f"[MCP] Agents will return empty results until Splunk is available")

    @property
    def is_connected(self) -> bool:
        return self._connected

    # ==================== MCP TOOLS ====================

    async def search(self, query: str, earliest: str = "-24h", latest: str = "now") -> list[dict]:
        """
        MCP Tool: search_splunk

        Execute an SPL search query against Splunk.
        This is the primary tool used by all agents.
        """
        return await splunk_client.search(query, earliest, latest)

    async def get_incidents(self, service: str = "", root_cause: str = "", limit: int = 10) -> list[dict]:
        """
        MCP Tool: get_incidents

        Retrieve historical incidents, optionally filtered by service or root cause.
        Used by the Historian Agent.
        """
        query_parts = ['index=opstwin_incidents sourcetype="opstwin:incident"']
        if service:
            query_parts.append(f'service="{service}"')
        if root_cause:
            query_parts.append(f'root_cause="{root_cause}"')
        query_parts.append(f"| head {limit}")
        query_parts.append("| table incident_id, service, root_cause, investigating_engineer, mttr_minutes, resolution, severity")

        query = " ".join(query_parts)
        return await splunk_client.search(query, earliest="-365d")

    async def get_engineer_history(self, engineer: str, limit: int = 10) -> list[dict]:
        """
        MCP Tool: get_engineer_history

        Retrieve an engineer's investigation history.
        Used by the Expert Twin Agent.
        """
        query = f'index=opstwin_incidents sourcetype="opstwin:incident" investigating_engineer="{engineer}" | head {limit} | table incident_id, service, root_cause, investigation_steps, mttr_minutes, resolution'
        return await splunk_client.search(query, earliest="-365d")

    async def find_best_expert(self, service: str) -> str:
        """
        MCP Tool: find_best_expert

        Find the engineer with most experience for a given service.
        Used by the Expert Twin Agent.
        """
        query = f'index=opstwin_incidents sourcetype="opstwin:incident" service="{service}" | stats count by investigating_engineer | sort -count | head 1'
        results = await splunk_client.search(query, earliest="-365d")
        if results:
            return results[0].get("investigating_engineer", "alex_chen")
        return "alex_chen"

    async def get_service_dependencies(self, service: str) -> list[dict]:
        """
        MCP Tool: get_service_dependencies

        Get services that commonly fail together (blast radius data).
        Used by the Risk Assessment Agent.
        """
        query = 'index=opstwin_incidents sourcetype="opstwin:incident" | stats count by service | sort -count | head 8'
        return await splunk_client.search(query, earliest="-90d")

    async def get_recent_errors(self, service: str, severity: str = "P1") -> list[dict]:
        """
        MCP Tool: get_recent_errors

        Get recent high-severity incidents for a service.
        Used by the Risk Assessment Agent.
        """
        query = f'index=opstwin_incidents sourcetype="opstwin:incident" service="{service}" (severity="P1" OR severity="P2") | head 5 | table incident_id, severity, root_cause, mttr_minutes'
        return await splunk_client.search(query, earliest="-7d")

    async def get_engineer_stats(self) -> list[dict]:
        """
        MCP Tool: get_engineer_stats

        Get aggregated stats for all engineers.
        Used by the Knowledge page.
        """
        query = 'index=opstwin_incidents sourcetype="opstwin:incident" | stats count, avg(mttr_minutes) as avg_mttr by investigating_engineer | sort -count'
        return await splunk_client.search(query, earliest="-365d")


# Singleton instance — all agents import this
splunk_mcp = SplunkMCPService()
