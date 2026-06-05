"""
Generate 500 synthetic incident events and send them to Splunk via HEC.

Usage:
    python generate_incidents.py

Requires:
    - Splunk running with HEC enabled
    - Set SPLUNK_HEC_TOKEN env var or pass as argument
"""

import json
import random
import datetime
import os
import sys

import httpx

HEC_URL = os.getenv("SPLUNK_HEC_URL", "https://localhost:8088/services/collector/event")
HEC_TOKEN = os.getenv("SPLUNK_HEC_TOKEN", "")

ENGINEERS = ["alex_chen", "maria_garcia", "james_wilson", "priya_patel"]
SERVICES = [
    "api-gateway",
    "redis-cluster",
    "postgres-primary",
    "auth-service",
    "payment-service",
    "search-indexer",
    "user-profile-db",
    "cdn-edge-nodes",
]
ROOT_CAUSES = [
    "memory_leak",
    "connection_pool_exhaustion",
    "disk_full",
    "cpu_spike",
    "network_partition",
    "dns_resolution_failure",
    "certificate_expiry",
    "deployment_regression",
]
INVESTIGATION_STEPS_POOL = [
    "Checked service dashboard for anomalies",
    "Queried Splunk logs for error patterns",
    "Ran redis-cli INFO memory",
    "Checked pod resource limits via kubectl",
    "Reviewed recent deployments in CI/CD",
    "Correlated with upstream service latency",
    "Analyzed database slow query log",
    "Verified DNS resolution timing",
    "Checked certificate expiry dates",
    "Reviewed connection pool metrics",
    "Inspected network packet loss rates",
    "Analyzed heap dumps for memory leaks",
]


def generate_incident(incident_id: int) -> dict:
    engineer = random.choice(ENGINEERS)
    service = random.choice(SERVICES)
    root_cause = random.choice(ROOT_CAUSES)
    severity = random.choices(["P1", "P2", "P3"], weights=[15, 35, 50])[0]
    mttr = random.randint(5, 240)

    steps = random.sample(INVESTIGATION_STEPS_POOL, k=random.randint(3, 6))

    timestamp = datetime.datetime.now() - datetime.timedelta(
        days=random.randint(1, 365),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59),
    )

    return {
        "event": {
            "incident_id": f"INC-{incident_id:04d}",
            "timestamp": timestamp.isoformat(),
            "severity": severity,
            "service": service,
            "root_cause": root_cause,
            "investigating_engineer": engineer,
            "investigation_steps": steps,
            "resolution": f"Resolved {root_cause} on {service} by {engineer}",
            "mttr_minutes": mttr,
            "status": "resolved",
            "confidence_score": round(random.uniform(0.65, 0.99), 2),
        },
        "sourcetype": "opstwin:incident",
        "index": "opstwin_incidents",
    }


def ingest_to_splunk(events: list[dict]) -> dict:
    if not HEC_TOKEN:
        print("ERROR: SPLUNK_HEC_TOKEN not set. Set it via environment variable.")
        print("       export SPLUNK_HEC_TOKEN=<your-token>")
        sys.exit(1)

    headers = {"Authorization": f"Splunk {HEC_TOKEN}"}
    success = 0
    errors = 0

    with httpx.Client(verify=False, timeout=10) as client:
        for event in events:
            try:
                resp = client.post(HEC_URL, json=event, headers=headers)
                if resp.status_code == 200:
                    success += 1
                else:
                    errors += 1
                    if errors <= 3:
                        print(f"  Error: {resp.status_code} - {resp.text}")
            except Exception as e:
                errors += 1
                if errors <= 3:
                    print(f"  Connection error: {e}")

    return {"success": success, "errors": errors}


def save_to_json(events: list[dict], filename: str = "sample_incidents.json"):
    """Save events to JSON file (for loading without Splunk)."""
    with open(filename, "w") as f:
        json.dump([e["event"] for e in events], f, indent=2)
    print(f"Saved {len(events)} incidents to {filename}")


def main():
    count = 500
    print(f"Generating {count} synthetic incidents...")

    events = [generate_incident(i) for i in range(1, count + 1)]

    # Always save to JSON for local testing
    save_to_json(events)

    # Try to ingest to Splunk if token is available
    if HEC_TOKEN:
        print(f"Ingesting {count} events to Splunk HEC at {HEC_URL}...")
        result = ingest_to_splunk(events)
        print(f"Done: {result['success']} success, {result['errors']} errors")
    else:
        print("No SPLUNK_HEC_TOKEN set — skipping Splunk ingestion.")
        print("Events saved to sample_incidents.json for local use.")


if __name__ == "__main__":
    main()
