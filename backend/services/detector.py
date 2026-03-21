from ultralytics import YOLO
from PIL import Image
import io
import numpy as np

from config import MODEL_PATH, CONFIDENCE_THRESHOLD, IOU_THRESHOLD
from models.schemas import Detection

CLASS_NAMES = {
    0: "person", 1: "car", 2: "truck", 3: "bus", 4: "motorcycle",
    5: "red light", 6: "green light", 7: "stop sign", 8: "no entry",
    9: "no overtaking", 10: "speed limit 20", 11: "speed limit 30",
    12: "speed limit 40", 13: "speed limit 50", 14: "speed limit 60",
    15: "speed limit 70", 16: "speed limit 80", 17: "speed limit 100",
    18: "speed limit 120", 19: "no left turn", 20: "no right turn",
    21: "no stopping", 22: "no u-turn",
}

VEHICLES = {0, 1, 2, 3, 4}  # person included for pedestrian risk
VEHICLE_ONLY = {1, 2, 3, 4}
SIGNS = set(range(5, 23))

_model = None


def load_model():
    global _model
    _model = YOLO(MODEL_PATH)
    # Warm up with a dummy inference
    dummy = np.zeros((640, 640, 3), dtype=np.uint8)
    _model.predict(source=dummy, verbose=False)
    return _model


def get_model() -> YOLO:
    if _model is None:
        raise RuntimeError("Model not loaded. Call load_model() first.")
    return _model


def detect(image_bytes: bytes) -> tuple[list[Detection], Image.Image]:
    model = get_model()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_w, img_h = image.size

    results = model.predict(
        source=image,
        conf=CONFIDENCE_THRESHOLD,
        iou=IOU_THRESHOLD,
        verbose=False,
    )

    detections = []
    for result in results:
        boxes = result.boxes
        for i in range(len(boxes)):
            xyxy = boxes.xyxy[i].cpu().numpy()
            cls_id = int(boxes.cls[i].cpu().numpy())
            conf = float(boxes.conf[i].cpu().numpy())

            detections.append(Detection(
                class_id=cls_id,
                class_name=CLASS_NAMES.get(cls_id, f"class_{cls_id}"),
                confidence=round(conf, 3),
                bbox=[
                    round(float(xyxy[0]) / img_w, 4),
                    round(float(xyxy[1]) / img_h, 4),
                    round(float(xyxy[2]) / img_w, 4),
                    round(float(xyxy[3]) / img_h, 4),
                ],
            ))

    return detections, image
