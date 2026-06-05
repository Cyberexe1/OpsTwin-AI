from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "OpsTwin AI",
        "version": "0.1.0",
        "phase": 1,
        "components": {
            "api": "online",
            "splunk": "pending",
        },
    }
