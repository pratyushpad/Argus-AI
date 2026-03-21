import os

MODEL_PATH = os.getenv("MODEL_PATH", "model/best.pt")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.25"))
IOU_THRESHOLD = float(os.getenv("IOU_THRESHOLD", "0.45"))
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
PROXIMITY_THRESHOLD = 0.15  # Normalized distance threshold for violation detection
