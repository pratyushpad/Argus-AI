#!/bin/bash
echo "Starting TrafficGuard AI Backend..."
cd "$(dirname "$0")"
source .venv/bin/activate
cd backend
pip install -r requirements.txt -q
echo "Starting server on http://localhost:8080"
echo "API docs at http://localhost:8080/docs"
python main.py
