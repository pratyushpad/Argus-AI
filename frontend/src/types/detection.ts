export interface Detection {
  class_id: number;
  class_name: string;
  confidence: number;
  bbox: number[];
}

export interface Violation {
  type: string;
  severity: "high" | "medium" | "low";
  description: string;
  involved_objects: string[];
}

export interface DetectionResponse {
  detections: Detection[];
  violations: Violation[];
  annotated_image: string;
  summary: {
    total_objects: number;
    violation_count: number;
    high_severity: number;
    medium_severity: number;
    low_severity: number;
  };
}
