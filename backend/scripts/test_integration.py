"""
End-to-end integration test for OpsTwin AI.
Tests: Health → Investigations List → Investigation Start (full agent pipeline)

Usage:
    python scripts/test_integration.py
"""

import httpx
import json
import sys
import time

BASE_URL = "http://localhost:8001"


def test_health():
    print("1. Testing /health endpoint...")
    resp = httpx.get(f"{BASE_URL}/health")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    assert data["status"] == "healthy"
    print(f"   ✓ Status: {data['status']}, Version: {data['version']}")
    return True


def test_investigations_list():
    print("2. Testing GET /api/v1/investigations...")
    resp = httpx.get(f"{BASE_URL}/api/v1/investigations")
    assert resp.status_code == 200
    data = resp.json()
    assert "investigations" in data
    assert len(data["investigations"]) > 0
    print(f"   ✓ Found {data['total']} investigations")
    return True


def test_analytics_summary():
    print("3. Testing GET /api/v1/analytics/summary...")
    resp = httpx.get(f"{BASE_URL}/api/v1/analytics/summary")
    assert resp.status_code == 200
    data = resp.json()
    assert "mttr_reduction" in data
    assert "agents" in data
    print(f"   ✓ MTTR Reduction: {data['mttr_reduction']}%, Agents: {len(data['agents'])}")
    return True


def test_investigation_start():
    print("4. Testing POST /api/v1/investigation/start (full agent pipeline)...")
    print("   This triggers: Historian → Expert Twin → Risk → Resolution Planner")
    print("   Querying real Splunk data...")

    start = time.time()
    resp = httpx.post(
        f"{BASE_URL}/api/v1/investigation/start",
        json={
            "service": "redis-cluster",
            "symptoms": ["memory_saturation", "latency_spike"],
            "severity": "P1",
            "root_cause_hint": "memory_leak",
        },
        timeout=60,
    )
    elapsed = time.time() - start

    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()

    print(f"   ✓ Incident ID: {data['incident_id']}")
    print(f"   ✓ Status: {data['status']}")
    print(f"   ✓ Overall Confidence: {data['overall_confidence']}")
    print(f"   ✓ Time taken: {elapsed:.2f}s")

    # Verify agent outputs
    agents = data.get("agent_outputs", {})
    for agent_name, output in agents.items():
        conf = output.get("confidence", 0) if output else 0
        print(f"     - {agent_name}: confidence={conf}")

    # Verify resolution plan
    plan = data.get("resolution_plan", {})
    steps = plan.get("steps", [])
    print(f"   ✓ Resolution Plan: {len(steps)} steps, Risk: {plan.get('risk_level', 'N/A')}")

    if steps:
        print(f"     Step 1: {steps[0][:60]}...")

    return True


def main():
    print("=" * 60)
    print("OpsTwin AI — Integration Test Suite")
    print("=" * 60)
    print()

    tests = [
        ("Health Check", test_health),
        ("Investigations List", test_investigations_list),
        ("Analytics Summary", test_analytics_summary),
        ("Full Investigation Pipeline", test_investigation_start),
    ]

    passed = 0
    failed = 0

    for name, test_fn in tests:
        try:
            test_fn()
            passed += 1
            print()
        except Exception as e:
            print(f"   ✗ FAILED: {e}")
            failed += 1
            print()

    print("=" * 60)
    print(f"Results: {passed} passed, {failed} failed")
    print("=" * 60)

    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
