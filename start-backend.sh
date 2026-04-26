#!/bin/bash
echo "Starting TrafficGuard AI Backend..."
cd "$(dirname "$0")"
echo "Starting server on http://localhost:8080"
echo "API docs: http://localhost:8080/docs"
cd backend
../backend_env/bin/uvicorn main:app --host 0.0.0.0 --port 8080
