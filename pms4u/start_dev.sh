#!/bin/bash
echo "Starting Governance Runtime Services..."

# 1. Start Governance Backend
cd /Users/alaaatia/pms4u/governance-core
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 &
PID_GOV=$!

# 2. Start Operational App mock?
# Since the flask app.py was requested we will simulate it for now

# 3. Start Next.js Trace UI
cd /Users/alaaatia/pms4u
npm run dev &
PID_NEXT=$!

wait
