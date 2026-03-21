from fastapi import APIRouter, UploadFile, File, HTTPException

from config import MAX_IMAGE_SIZE
from models.schemas import DetectionResponse
from services.detector import detect, is_model_loaded
from services.violation_rules import check_violations
from services.annotator import annotate_image

router = APIRouter(prefix="/api", tags=["detection"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.post("/detect", response_model=DetectionResponse)
async def detect_violations(file: UploadFile = File(...)):
    # Validate input first (give useful errors even if model is down)
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, f"File type {file.content_type} not supported. Use JPEG, PNG, or WebP.")

    image_bytes = await file.read()
    if len(image_bytes) > MAX_IMAGE_SIZE:
        raise HTTPException(400, "Image exceeds 10MB limit.")

    if not is_model_loaded():
        raise HTTPException(
            503,
            "Model not loaded. Train a model first (python model/train.py) "
            "and place best.pt in model/best.pt, then restart the server."
        )

    detections, original_image = detect(image_bytes)
    violations = check_violations(detections)
    annotated_b64 = annotate_image(original_image, detections, violations)

    return DetectionResponse(
        detections=detections,
        violations=violations,
        annotated_image=annotated_b64,
        summary={
            "total_objects": len(detections),
            "violation_count": len(violations),
            "high_severity": sum(1 for v in violations if v.severity == "high"),
            "medium_severity": sum(1 for v in violations if v.severity == "medium"),
            "low_severity": sum(1 for v in violations if v.severity == "low"),
        },
    )
