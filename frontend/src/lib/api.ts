import { DetectionResponse } from "@/types/detection";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function detectViolations(
  file: File
): Promise<DetectionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/detect`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Detection failed" }));
    throw new Error(err.detail || `Error ${res.status}`);
  }

  return res.json();
}
