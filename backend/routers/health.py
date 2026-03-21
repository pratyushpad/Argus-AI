from fastapi import APIRouter
from services.detector import is_model_loaded

router = APIRouter(tags=["health"])


@router.get("/health")
async def health():
    return {
        "status": "ok",
        "model_loaded": is_model_loaded(),
    }
