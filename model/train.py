"""
Traffic Violation Detector - YOLOv8 Training Script
Run on a machine with GPU (Google Colab recommended for free T4)
"""
from ultralytics import YOLO
import argparse
import os


def train(data_yaml: str, epochs: int = 80, batch: int = 16, imgsz: int = 640):
    model = YOLO("yolov8s.pt")

    results = model.train(
        data=data_yaml,
        epochs=epochs,
        imgsz=imgsz,
        batch=8,
        patience=15,
        project="runs",
        name="traffic_violation",
        device="mps",  # Change to 0 for NVIDIA GPU, "cpu" for CPU
        # Augmentation (defaults are good, but explicit for clarity)
        mosaic=1.0,
        mixup=0.1,
        hsv_h=0.015,
        hsv_s=0.7,
        hsv_v=0.4,
        flipud=0.0,
        fliplr=0.5,
    )

    # Validate
    metrics = model.val()
    print(f"\nmAP50: {metrics.box.map50:.4f}")
    print(f"mAP50-95: {metrics.box.map:.4f}")

    # Export best weights path
    best_path = os.path.join("runs", "traffic_violation", "weights", "best.pt")
    print(f"\nBest weights saved to: {best_path}")
    return best_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="model/data.yaml", help="Path to data.yaml")
    parser.add_argument("--epochs", type=int, default=80)
    parser.add_argument("--batch", type=int, default=16)
    parser.add_argument("--imgsz", type=int, default=640)
    args = parser.parse_args()

    train(args.data, args.epochs, args.batch, args.imgsz)
