#!/bin/bash
echo "Starting TrafficGuard AI Frontend..."
cd "$(dirname "$0")/frontend"
npm install -q
echo "Starting dev server on http://localhost:3000"
npm run dev
