# infosec-feed/run.py

import subprocess
import sys
import os
import signal

ROOT    = os.path.dirname(__file__)
BACKEND = os.path.join(ROOT, 'backend')
FRONTEND = os.path.join(ROOT, 'frontend')

processes = []

def shutdown(sig, frame):
    print('\n⚡ Shutting down...')
    for p in processes:
        p.terminate()
    sys.exit(0)

signal.signal(signal.SIGINT,  shutdown)
signal.signal(signal.SIGTERM, shutdown)

print('🚀 Starting backend  → http://localhost:8000')
print('🚀 Starting frontend → http://localhost:5173')
print('   Press Ctrl+C to stop both\n')

backend = subprocess.Popen(
    ['bash', '-c', 'source .venv/bin/activate && uvicorn src.main:app --reload --port 8000'],
    cwd=BACKEND,
)

frontend = subprocess.Popen(
    ['npm', 'run', 'dev'],
    cwd=FRONTEND,
)

processes = [backend, frontend]

backend.wait()
frontend.wait()
