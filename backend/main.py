from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import detection, health
from services.detector import load_model


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    print("Model loaded and ready.")
    yield


app = FastAPI(
    title="Traffic Violation Detector API",
    description="AI-powered traffic violation detection from dashcam images",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(detection.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
