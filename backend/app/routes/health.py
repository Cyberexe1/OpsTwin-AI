from fastapi import APIRouter

from app.services.splunk_client import splunk_client

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    # Test Splunk connection
    splunk_status = await splunk_client.check_connection()

    return {
        "status": "healthy",
        "service": "OpsTwin AI",
        "version": "0.2.0",
        "components": {
            "api": "online",
            "splunk": "online" if splunk_status.get("connected") else "offline",
            "splunk_version": splunk_status.get("version", "unknown"),
            "database": "online",
            "llm": "online",
        },
    }
