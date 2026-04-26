import os

# Resolve model path relative to the project root (one level up from backend/)
_project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.getenv("MODEL_PATH", os.path.join(_project_root, "model", "best.pt"))
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.25"))
IOU_THRESHOLD = float(os.getenv("IOU_THRESHOLD", "0.45"))
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
PROXIMITY_THRESHOLD = 0.15  # Normalized distance threshold for violation detection
