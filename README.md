# TrafficGuard AI

A full-stack web app that detects traffic violations from dashcam images. Upload a photo and the app identifies vehicles, traffic signs, pedestrians, and flags violations like red light running or no-entry breaches.

I built this to explore computer vision with real-world applications. The model is trained on ~5,200 dashcam images across 23 object classes, and the violation logic uses spatial proximity rules between detected objects.

## How It Works

1. User uploads a dashcam image through the web interface
2. The image is sent to the FastAPI backend
3. YOLOv8 runs inference to detect objects (cars, signs, lights, pedestrians, etc.)
4. A rule engine checks spatial relationships between detections to flag violations
5. The annotated image with bounding boxes and a violation report is returned

## What It Detects

**Objects (23 classes):** cars, trucks, buses, motorcycles, pedestrians, red/green lights, stop signs, speed limit signs (20-120 km/h), no entry, no overtaking, no turn signs, no stopping, no U-turn

**Violations:**
- Red light running (vehicle near red light)
- Stop sign / no-entry breaches
- Pedestrian proximity risk
- No-turn and no-stopping zone violations
- Speed zone awareness alerts

## Tech Stack

- **Model:** YOLOv8s trained with ultralytics on the Traffic Violation V2 dataset from Kaggle
- **Backend:** Python, FastAPI — handles inference, violation logic, and image annotation
- **Frontend:** Next.js 16, TypeScript, Tailwind CSS — drag-and-drop upload with real-time results
- **Deployment:** Docker + Google Cloud Run

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A trained model file (`best.pt`) — see training section below

### Run Locally

**Backend:**
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cd backend && python main.py
```
API runs at `http://localhost:8080` (Swagger docs at `/docs`).

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Opens at `http://localhost:3000`.

**Or with Docker:**
```bash
docker compose up --build
```

### Train the Model

If you want to retrain from scratch:
```bash
pip install ultralytics
python model/train.py --data model/data.yaml --epochs 100 --batch 8
```
This takes about 2-3 hours on an M-series Mac (MPS) or ~30 min on a T4 GPU (Colab). The best weights get saved to `runs/traffic_violation/weights/best.pt` — copy that to `model/best.pt`.

### Deploy to Google Cloud

```bash
gcloud run deploy trafficguard-api --source=./backend --region=us-central1 --memory=2Gi --cpu=2 --allow-unauthenticated

gcloud run deploy trafficguard-web --source=./frontend --region=us-central1 --allow-unauthenticated
```

## Project Structure

```
├── model/            # Training script and data config
├── backend/          # FastAPI app (detection, violation rules, annotator)
├── frontend/         # Next.js app (upload UI, results display)
├── deploy/           # Cloud Build config
├── images/           # Training & validation images
├── labels/           # YOLO-format annotation labels
└── docker-compose.yml
```

## What I Learned

- Training YOLOv8 on a custom dataset with mixed image sizes and 23 classes
- Building spatial proximity rules to infer violations from static image detections
- Connecting a Python ML backend to a modern React frontend
- Containerizing and deploying ML workloads to Google Cloud Run
