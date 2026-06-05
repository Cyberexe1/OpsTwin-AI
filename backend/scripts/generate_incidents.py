"""
Generate realistic incident data with coherent investigation stories.
Each engineer has specialization patterns that the Expert Twin can learn from.

Usage:
    set SPLUNK_HEC_TOKEN=your-token
    set SPLUNK_HEC_URL=http://localhost:8088/services/collector/event
    python scripts/generate_incidents.py
"""

import json
import random
import datetime
import os
import sys

import httpx

HEC_URL = os.getenv("SPLUNK_HEC_URL", "http://localhost:8088/services/collector/event")
HEC_TOKEN = os.getenv("SPLUNK_HEC_TOKEN", "")

# ============================================================
# ENGINEER PROFILES — Each has specialization + investigation style
# ============================================================

ENGINEERS = {
    "alex_chen": {
        "specialty": "infrastructure",
        "services": ["redis-cluster", "api-gateway", "cdn-edge-nodes"],
        "service_weights": [0.45, 0.35, 0.20],
        "root_causes": ["memory_leak", "connection_pool_exhaustion", "cpu_spike"],
        "cause_weights": [0.50, 0.30, 0.20],
        "investigation_style": [
            "Checked Redis memory via redis-cli INFO memory",
            "Verified mem_fragmentation_ratio (target < 1.5)",
            "Inspected maxmemory-policy configuration",
            "Reviewed SLOWLOG for expensive commands",
            "Checked connection pool metrics in Grafana",
            "Correlated with recent deployment timeline",
            "Verified pod resource limits via kubectl top pods",
            "Restarted affected pods with kubectl rollout restart",
        ],
        "avg_mttr_range": (8, 35),
    },
    "maria_garcia": {
        "specialty": "security",
        "services": ["auth-service", "payment-service", "user-profile-db"],
        "service_weights": [0.50, 0.30, 0.20],
        "root_causes": ["certificate_expiry", "connection_pool_exhaustion", "dns_resolution_failure"],
        "cause_weights": [0.40, 0.35, 0.25],
        "investigation_style": [
            "Checked SSL certificate expiry dates",
            "Verified IAM role permissions in CloudTrail",
            "Inspected connection pool saturation metrics",
            "Reviewed auth token validation logs",
            "Checked database connection string rotation status",
            "Verified DNS resolution timing via dig command",
            "Rotated expired certificates and redeployed",
            "Updated connection pool max_size configuration",
        ],
        "avg_mttr_range": (12, 45),
    },
    "james_wilson": {
        "specialty": "data_reliability",
        "services": ["postgres-primary", "search-indexer", "redis-cluster"],
        "service_weights": [0.50, 0.30, 0.20],
        "root_causes": ["disk_full", "connection_pool_exhaustion", "deployment_regression"],
        "cause_weights": [0.40, 0.35, 0.25],
        "investigation_style": [
            "Checked PostgreSQL vacuum status and dead tuples",
            "Reviewed disk usage with df -h on data volumes",
            "Inspected pg_stat_activity for long-running queries",
            "Verified replication lag between primary and replicas",
            "Checked WAL file accumulation",
            "Reviewed recent schema migrations",
            "Ran VACUUM FULL on affected tables",
            "Increased disk volume size via cloud console",
        ],
        "avg_mttr_range": (15, 60),
    },
    "priya_patel": {
        "specialty": "platform_sre",
        "services": ["api-gateway", "auth-service", "cdn-edge-nodes", "search-indexer"],
        "service_weights": [0.30, 0.25, 0.25, 0.20],
        "root_causes": ["cpu_spike", "network_partition", "deployment_regression", "memory_leak"],
        "cause_weights": [0.30, 0.25, 0.25, 0.20],
        "investigation_style": [
            "Checked CPU steal time for noisy neighbor issues",
            "Verified network connectivity between AZs",
            "Reviewed recent deployments in CI/CD pipeline",
            "Checked auto-scaling events and thresholds",
            "Inspected load balancer health check failures",
            "Correlated with upstream provider status page",
            "Rolled back latest deployment to previous version",
            "Adjusted auto-scaling thresholds and cooldown period",
        ],
        "avg_mttr_range": (10, 50),
    },
}

# ============================================================
# RESOLUTION TEMPLATES — Specific to root cause + service combos
# ============================================================

RESOLUTION_TEMPLATES = {
    "memory_leak": {
        "redis-cluster": "Identified memory fragmentation (ratio 2.3). Flushed stale keys in auth:session namespace and restarted Redis pods. Memory stabilized at 65% utilization.",
        "api-gateway": "Found unbounded in-memory cache in request middleware. Applied LRU eviction with 512MB cap. Memory growth stopped.",
        "default": "Identified memory leak in application heap. Restarted affected containers and applied memory limit fix.",
    },
    "connection_pool_exhaustion": {
        "auth-service": "Connection pool saturated at 100/100. Slow auth queries holding connections. Added statement_timeout=5s and increased pool to 150.",
        "postgres-primary": "All 50 connections consumed by idle-in-transaction sessions. Killed zombie connections and set idle_in_transaction_session_timeout=60s.",
        "payment-service": "Payment webhook retries holding DB connections. Fixed retry logic to release connections on failure. Pool usage dropped from 98% to 34%.",
        "default": "Connection pool exhausted. Increased pool size and added connection timeout configuration.",
    },
    "cpu_spike": {
        "api-gateway": "Regex-based WAF rule causing O(n^2) backtracking on large request bodies. Replaced with RE2 engine. CPU dropped from 94% to 12%.",
        "search-indexer": "Elasticsearch re-indexing job running without rate limiting. Added bulk_size throttling. CPU normalized within 3 minutes.",
        "default": "Identified CPU-intensive process. Applied resource limits and optimized the hot path.",
    },
    "disk_full": {
        "postgres-primary": "WAL files accumulated due to failed replication slot. Dropped stale slot, WAL cleanup freed 89GB. Added monitoring alert at 80%.",
        "search-indexer": "Debug logging left enabled in production. Rotated logs (freed 120GB) and set log level back to WARN.",
        "default": "Disk usage exceeded threshold. Cleaned old data and adjusted retention policies.",
    },
    "certificate_expiry": {
        "auth-service": "TLS certificate expired 2 hours ago. Auto-renewal failed due to DNS challenge timeout. Manually renewed via certbot and reloaded nginx.",
        "payment-service": "Mutual TLS cert for payment processor expired. Generated new cert, updated vault, and redeployed affected pods.",
        "default": "Certificate expired. Renewed and redeployed the service.",
    },
    "dns_resolution_failure": {
        "cdn-edge-nodes": "Route53 health check flapping due to timeout threshold too low (2s). Increased to 5s and added retry logic in the CDN config.",
        "auth-service": "Internal DNS cache returning stale entries after service mesh update. Flushed CoreDNS cache and restarted dns pods.",
        "default": "DNS resolution failing intermittently. Fixed upstream DNS configuration.",
    },
    "network_partition": {
        "api-gateway": "Network partition between us-east-1a and us-east-1b due to VPC peering route table misconfiguration. Corrected route entries, connectivity restored in 4 minutes.",
        "default": "Network partition detected between availability zones. Corrected routing configuration.",
    },
    "deployment_regression": {
        "api-gateway": "Deploy #D-1247 introduced null pointer in auth middleware. Rolled back to #D-1246 within 8 minutes. Post-fix deployed next day with null check.",
        "search-indexer": "New indexing batch size (5000→50000) caused OOM kills. Reverted batch size and added gradual ramp-up logic.",
        "auth-service": "OAuth token validation endpoint regression. New regex pattern rejected valid tokens with '+' in email. Rolled back and added test cases.",
        "default": "Recent deployment caused regression. Rolled back to previous stable version.",
    },
}


def get_resolution(root_cause, service):
    templates = RESOLUTION_TEMPLATES.get(root_cause, {})
    return templates.get(service, templates.get("default", f"Resolved {root_cause} on {service}."))


# ============================================================
# INCIDENT GENERATOR
# ============================================================

def generate_incident(incident_id):
    # Pick engineer (weighted — alex gets more since he's the "senior" one)
    engineer_name = random.choices(
        list(ENGINEERS.keys()),
        weights=[0.35, 0.25, 0.20, 0.20],
    )[0]
    profile = ENGINEERS[engineer_name]

    # Pick service and root cause based on engineer's specialty
    service = random.choices(profile["services"], weights=profile["service_weights"])[0]
    root_cause = random.choices(profile["root_causes"], weights=profile["cause_weights"])[0]

    # Severity — weighted toward P2/P3
    severity = random.choices(["P1", "P2", "P3"], weights=[15, 40, 45])[0]

    # MTTR based on engineer's speed + severity
    base_mttr = random.randint(*profile["avg_mttr_range"])
    if severity == "P1":
        mttr = base_mttr  # urgent = faster response
    elif severity == "P2":
        mttr = int(base_mttr * 1.3)
    else:
        mttr = int(base_mttr * 1.8)

    # Investigation steps — pick 4-6 from engineer's style (in order)
    num_steps = random.randint(4, 6)
    steps = profile["investigation_style"][:num_steps]

    # Resolution — specific to root_cause + service
    resolution = get_resolution(root_cause, service)

    # Timestamp spread across the past year
    timestamp = datetime.datetime.now() - datetime.timedelta(
        days=random.randint(1, 365),
        hours=random.randint(0, 23),
        minutes=random.randint(0, 59),
    )

    # Confidence score — higher for experienced engineers on their specialty
    confidence = round(random.uniform(0.78, 0.99), 2)

    return {
        "event": {
            "incident_id": f"INC-{incident_id:04d}",
            "timestamp": timestamp.isoformat(),
            "severity": severity,
            "service": service,
            "root_cause": root_cause,
            "investigating_engineer": engineer_name,
            "investigation_steps": steps,
            "resolution": resolution,
            "mttr_minutes": mttr,
            "status": "resolved",
            "confidence_score": confidence,
            "specialty": profile["specialty"],
        },
        "sourcetype": "opstwin:incident",
        "index": "opstwin_incidents",
    }


# ============================================================
# INGESTION
# ============================================================

def ingest_to_splunk(events):
    if not HEC_TOKEN:
        print("ERROR: SPLUNK_HEC_TOKEN not set.")
        print("  set SPLUNK_HEC_TOKEN=<your-token>")
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


def save_to_json(events, filename="sample_incidents.json"):
    with open(filename, "w") as f:
        json.dump([e["event"] for e in events], f, indent=2)
    print(f"Saved {len(events)} incidents to {filename}")


def print_stats(events):
    from collections import Counter
    engineers = Counter(e["event"]["investigating_engineer"] for e in events)
    services = Counter(e["event"]["service"] for e in events)
    causes = Counter(e["event"]["root_cause"] for e in events)

    print("\n--- Engineer Distribution ---")
    for eng, count in engineers.most_common():
        print(f"  {eng}: {count} incidents")

    print("\n--- Service Distribution ---")
    for svc, count in services.most_common():
        print(f"  {svc}: {count} incidents")

    print("\n--- Root Cause Distribution ---")
    for cause, count in causes.most_common():
        print(f"  {cause}: {count} incidents")


def main():
    count = 500
    print(f"Generating {count} realistic incidents with engineer specialization...")

    events = [generate_incident(i) for i in range(1, count + 1)]

    print_stats(events)
    save_to_json(events)

    if HEC_TOKEN:
        print(f"\nIngesting {count} events to Splunk HEC at {HEC_URL}...")
        result = ingest_to_splunk(events)
        print(f"Done: {result['success']} success, {result['errors']} errors")
    else:
        print("\nNo SPLUNK_HEC_TOKEN set — skipping Splunk ingestion.")
        print("Events saved to sample_incidents.json for local use.")


if __name__ == "__main__":
    main()
