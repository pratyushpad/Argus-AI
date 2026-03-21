import { DetectionResponse } from "@/types/detection";

export const DEMO_RESULT: DetectionResponse = {
  detections: [
    {
      class_id: 1,
      class_name: "car",
      confidence: 0.92,
      bbox: [0.12, 0.45, 0.38, 0.78],
    },
    {
      class_id: 1,
      class_name: "car",
      confidence: 0.87,
      bbox: [0.55, 0.42, 0.82, 0.75],
    },
    {
      class_id: 5,
      class_name: "red light",
      confidence: 0.95,
      bbox: [0.44, 0.05, 0.52, 0.2],
    },
    {
      class_id: 0,
      class_name: "person",
      confidence: 0.78,
      bbox: [0.4, 0.5, 0.46, 0.72],
    },
    {
      class_id: 13,
      class_name: "speed limit 50",
      confidence: 0.88,
      bbox: [0.88, 0.1, 0.96, 0.28],
    },
    {
      class_id: 2,
      class_name: "truck",
      confidence: 0.84,
      bbox: [0.6, 0.3, 0.95, 0.7],
    },
  ],
  violations: [
    {
      type: "red_light_running",
      severity: "high",
      description: "Vehicle detected near red traffic light",
      involved_objects: ["car (92%)", "red light (95%)"],
    },
    {
      type: "pedestrian_risk",
      severity: "high",
      description: "Pedestrian in close proximity to vehicle",
      involved_objects: ["person (78%)", "car (92%)"],
    },
    {
      type: "speed_zone_detected",
      severity: "low",
      description: "Vehicle in speed limit 50 zone",
      involved_objects: ["truck (84%)", "speed limit 50 (88%)"],
    },
  ],
  annotated_image: "",
  summary: {
    total_objects: 6,
    violation_count: 3,
    high_severity: 2,
    medium_severity: 0,
    low_severity: 1,
  },
};
