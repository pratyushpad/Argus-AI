import math
from models.schemas import Detection, Violation
from services.detector import VEHICLE_ONLY, CLASS_NAMES
from config import PROXIMITY_THRESHOLD


def _center(bbox: list[float]) -> tuple[float, float]:
    return ((bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2)


def _distance(bbox1: list[float], bbox2: list[float]) -> float:
    c1 = _center(bbox1)
    c2 = _center(bbox2)
    return math.sqrt((c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2)


def _is_near(det1: Detection, det2: Detection, threshold: float = PROXIMITY_THRESHOLD) -> bool:
    return _distance(det1.bbox, det2.bbox) < threshold


SIGN_VIOLATION_MAP = {
    5: ("red_light_running", "high", "Vehicle detected near red traffic light"),
    7: ("stop_sign_violation", "high", "Vehicle detected near stop sign"),
    8: ("no_entry_violation", "high", "Vehicle detected near no-entry sign"),
    9: ("no_overtaking_violation", "medium", "Vehicles detected near no-overtaking sign"),
    19: ("no_left_turn_violation", "medium", "Vehicle detected near no-left-turn sign"),
    20: ("no_right_turn_violation", "medium", "Vehicle detected near no-right-turn sign"),
    21: ("no_stopping_violation", "medium", "Vehicle detected in no-stopping zone"),
    22: ("no_u_turn_violation", "medium", "Vehicle detected near no-U-turn sign"),
}

SPEED_LIMIT_IDS = {10, 11, 12, 13, 14, 15, 16, 17, 18}


def check_violations(detections: list[Detection]) -> list[Violation]:
    violations = []
    vehicles = [d for d in detections if d.class_id in VEHICLE_ONLY]
    signs = [d for d in detections if d.class_id in SIGN_VIOLATION_MAP]
    speed_signs = [d for d in detections if d.class_id in SPEED_LIMIT_IDS]
    persons = [d for d in detections if d.class_id == 0]

    # Check vehicle-sign proximity violations
    for vehicle in vehicles:
        for sign in signs:
            if _is_near(vehicle, sign):
                vtype, severity, desc = SIGN_VIOLATION_MAP[sign.class_id]
                violations.append(Violation(
                    type=vtype,
                    severity=severity,
                    description=desc,
                    involved_objects=[
                        f"{vehicle.class_name} ({vehicle.confidence:.0%})",
                        f"{sign.class_name} ({sign.confidence:.0%})",
                    ],
                ))

    # Speed zone awareness
    for vehicle in vehicles:
        for sign in speed_signs:
            if _is_near(vehicle, sign, threshold=0.25):
                violations.append(Violation(
                    type="speed_zone_detected",
                    severity="low",
                    description=f"Vehicle in {sign.class_name} zone",
                    involved_objects=[
                        f"{vehicle.class_name} ({vehicle.confidence:.0%})",
                        f"{sign.class_name} ({sign.confidence:.0%})",
                    ],
                ))

    # Pedestrian risk
    for person in persons:
        for vehicle in vehicles:
            if _is_near(person, vehicle, threshold=0.1):
                violations.append(Violation(
                    type="pedestrian_risk",
                    severity="high",
                    description="Pedestrian in close proximity to vehicle",
                    involved_objects=[
                        f"person ({person.confidence:.0%})",
                        f"{vehicle.class_name} ({vehicle.confidence:.0%})",
                    ],
                ))

    return violations
