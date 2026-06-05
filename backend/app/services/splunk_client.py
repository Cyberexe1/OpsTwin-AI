import httpx
from app.config import settings


class SplunkClient:
    """Client for Splunk REST API and HEC."""

    def __init__(self):
        self.base_url = f"https://{settings.splunk_host}:{settings.splunk_port}"
        self.hec_url = f"https://{settings.splunk_host}:{settings.splunk_hec_port}/services/collector/event"
        self.auth = (settings.splunk_username, settings.splunk_password)

    async def search(self, query: str, earliest: str = "-24h", latest: str = "now") -> list:
        """Execute a Splunk oneshot search and return results."""
        async with httpx.AsyncClient(verify=False, timeout=30) as client:
            resp = await client.post(
                f"{self.base_url}/services/search/jobs",
                auth=self.auth,
                data={
                    "search": f"search {query}",
                    "earliest_time": earliest,
                    "latest_time": latest,
                    "output_mode": "json",
                    "exec_mode": "oneshot",
                },
            )
            if resp.status_code == 200:
                return resp.json().get("results", [])
            return []

    async def ingest_event(self, event: dict, sourcetype: str, index: str = "opstwin_incidents"):
        """Send a single event via HEC."""
        if not settings.splunk_hec_token:
            return {"status": "skipped", "reason": "no HEC token configured"}

        headers = {"Authorization": f"Splunk {settings.splunk_hec_token}"}
        payload = {
            "event": event,
            "sourcetype": sourcetype,
            "index": index,
        }
        async with httpx.AsyncClient(verify=False, timeout=10) as client:
            resp = await client.post(self.hec_url, json=payload, headers=headers)
            return {"status": resp.status_code, "text": resp.text}

    async def check_connection(self) -> dict:
        """Test connectivity to Splunk."""
        try:
            async with httpx.AsyncClient(verify=False, timeout=5) as client:
                resp = await client.get(
                    f"{self.base_url}/services/server/info",
                    auth=self.auth,
                    params={"output_mode": "json"},
                )
                if resp.status_code == 200:
                    info = resp.json()["entry"][0]["content"]
                    return {
                        "connected": True,
                        "version": info.get("version", "unknown"),
                        "server_name": info.get("serverName", "unknown"),
                    }
        except Exception as e:
            return {"connected": False, "error": str(e)}
        return {"connected": False, "error": "unexpected response"}


splunk_client = SplunkClient()
