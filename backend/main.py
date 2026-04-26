import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import detection, health
from services.detector import load_model
from config import MODEL_PATH


@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.path.exists(MODEL_PATH):
        load_model()
        print(f"Model loaded from {MODEL_PATH}")
    else:
        print(f"WARNING: Model not found at {MODEL_PATH}")
        print("The /api/detect endpoint will return an error until a model is available.")
        print("Train a model with: python model/train.py")
    yield


app = FastAPI(
    title="Traffic Violation Detector API",
    description="AI-powered traffic violation detection from dashcam images",
    version="1.0.0",
    lifespan=lifespan,
)

_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
_allowed_origins = [o.strip() for o in _origins_env.split(",") if o.strip()] or [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(detection.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
