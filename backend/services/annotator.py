import base64
import io
from PIL import Image, ImageDraw, ImageFont
from models.schemas import Detection, Violation
from services.detector import VEHICLE_ONLY, SIGNS

# Color scheme
COLORS = {
    "vehicle": (52, 199, 89),      # green
    "sign": (0, 122, 255),         # blue
    "person": (255, 204, 0),       # yellow
    "violation": (255, 59, 48),    # red
}


def _get_color(det: Detection, violation_objects: set[str]) -> tuple[int, ...]:
    if det.class_name in violation_objects:
        return COLORS["violation"]
    if det.class_id == 0:
        return COLORS["person"]
    if det.class_id in VEHICLE_ONLY:
        return COLORS["vehicle"]
    if det.class_id in SIGNS:
        return COLORS["sign"]
    return (128, 128, 128)


def annotate_image(
    image: Image.Image,
    detections: list[Detection],
    violations: list[Violation],
) -> str:
    img = image.copy()
    draw = ImageDraw.Draw(img)
    w, h = img.size

    # Collect objects involved in violations for red highlighting
    violation_objects: set[str] = set()
    for v in violations:
        for obj in v.involved_objects:
            name = obj.split(" (")[0]
            violation_objects.add(name)

    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", max(12, h // 50))
    except (OSError, IOError):
        font = ImageFont.load_default()

    for det in detections:
        x1 = int(det.bbox[0] * w)
        y1 = int(det.bbox[1] * h)
        x2 = int(det.bbox[2] * w)
        y2 = int(det.bbox[3] * h)

        color = _get_color(det, violation_objects)
        thickness = 3 if det.class_name in violation_objects else 2

        # Draw bounding box
        for t in range(thickness):
            draw.rectangle([x1 - t, y1 - t, x2 + t, y2 + t], outline=color)

        # Label background
        label = f"{det.class_name} {det.confidence:.0%}"
        bbox = font.getbbox(label)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
        draw.rectangle([x1, y1 - text_h - 6, x1 + text_w + 6, y1], fill=color)
        draw.text((x1 + 3, y1 - text_h - 4), label, fill=(255, 255, 255), font=font)

    # Violation banner at top
    if violations:
        high = sum(1 for v in violations if v.severity == "high")
        med = sum(1 for v in violations if v.severity == "medium")
        banner = f"⚠ {len(violations)} violation(s) detected"
        if high:
            banner += f" | {high} HIGH"
        if med:
            banner += f" | {med} MEDIUM"
        banner_h = max(30, h // 20)
        draw.rectangle([0, 0, w, banner_h], fill=(255, 59, 48, 200))
        draw.text((10, 5), banner, fill=(255, 255, 255), font=font)

    # Encode to base64
    buffer = io.BytesIO()
    img.save(buffer, format="PNG", quality=95)
    return base64.b64encode(buffer.getvalue()).decode("utf-8")
