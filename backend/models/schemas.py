from pydantic import BaseModel


class Detection(BaseModel):
    class_id: int
    class_name: str
    confidence: float
    bbox: list[float]  # [x1, y1, x2, y2] normalized


class Violation(BaseModel):
    type: str
    severity: str  # "high", "medium", "low"
    description: str
    involved_objects: list[str]


class DetectionResponse(BaseModel):
    detections: list[Detection]
    violations: list[Violation]
    annotated_image: str  # base64 encoded
    summary: dict
