#!/usr/bin/env python3
"""Launch backend and frontend as independent daemon processes."""
import subprocess
import os
import sys
import time

ROOT = os.path.dirname(os.path.abspath(__file__))
VENV_UVICORN = os.path.join(ROOT, ".venv", "bin", "uvicorn")

def spawn(cmd, cwd, logfile):
    log = open(logfile, "w")
    p = subprocess.Popen(
        cmd,
        cwd=cwd,
        stdout=log,
        stderr=log,
        start_new_session=True,  # detach from this process group
    )
    return p

print("Starting Argus AI...")

backend = spawn(
    [VENV_UVICORN, "main:app", "--host", "0.0.0.0", "--port", "8080", "--reload"],
    cwd=os.path.join(ROOT, "backend"),
    logfile=os.path.join(ROOT, "backend.log"),
)
print(f"  Backend started  (PID {backend.pid})  → http://localhost:8080")
print(f"  API docs         → http://localhost:8080/docs")

time.sleep(2)

frontend = spawn(
    ["npm", "run", "dev"],
    cwd=os.path.join(ROOT, "frontend"),
    logfile=os.path.join(ROOT, "frontend.log"),
)
print(f"  Frontend started (PID {frontend.pid}) → http://localhost:3000")

print("\nLogs:")
print(f"  tail -f {ROOT}/backend.log")
print(f"  tail -f {ROOT}/frontend.log")
print("\nTo stop:  kill", backend.pid, frontend.pid)
