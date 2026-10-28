"""
Traffic Violation Detector - YOLOv8 Training Script
The shipped model used 80 epochs, batch 16, imgsz 640 on a Colab GPU.
"""
from ultralytics import YOLO
import argparse
import os


def train(data_yaml: str, epochs: int = 80, batch: int = 16, imgsz: int = 640, device=None):
    model = YOLO("yolov8s.pt")

    results = model.train(
        data=data_yaml,
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        patience=15,
        project="runs",
        name="traffic_violation",
        device=device,  # None lets ultralytics pick (CUDA, then MPS, then CPU)
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
    parser.add_argument("--device", default=None, help='e.g. 0, mps or cpu (default: auto)')
    args = parser.parse_args()

    train(args.data, args.epochs, args.batch, args.imgsz, args.device)
