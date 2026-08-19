#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
LOGDIR="$ROOT/.local-logs"
mkdir -p "$LOGDIR"

echo "Running from: $ROOT"
echo "Logs -> $LOGDIR"

# Backend
echo "Installing backend deps (if missing)..."
cd "$ROOT/backend"
if [ ! -d node_modules ]; then
  npm install
fi

if [ "${1-}" = "--seed" ]; then
  if [ -z "${DATABASE_URL-}" ]; then
    echo "DATABASE_URL not set — skipping seed. Export DATABASE_URL and re-run with --seed to seed Postgres."
  else
    echo "Seeding Postgres (DATABASE_URL set)..."
    npm run seed
  fi
fi

echo "Starting backend (port 4000)..."
nohup npm start > "$LOGDIR/backend.log" 2>&1 &
echo $! > "$LOGDIR/backend.pid"
sleep 1
echo "Backend PID: $(cat "$LOGDIR/backend.pid")"

# Frontend
echo "Switching to frontend (repo root) and installing deps (if missing)..."
cd "$ROOT"
if [ ! -d node_modules ]; then
  npm install
fi

echo "Starting Next dev server (port 3000)..."
nohup npm run dev > "$LOGDIR/frontend.log" 2>&1 &
echo $! > "$LOGDIR/frontend.pid"
sleep 1
echo "Frontend PID: $(cat "$LOGDIR/frontend.pid")"

echo
echo "Services started:"
echo " - Frontend: http://localhost:3000 (log: $LOGDIR/frontend.log)"
echo " - Backend:  http://localhost:4000 (log: $LOGDIR/backend.log)"
echo
echo "To watch logs:" 
echo " tail -f $LOGDIR/frontend.log"
echo " tail -f $LOGDIR/backend.log"
echo
echo "To stop:" 
echo " kill \$(cat $LOGDIR/frontend.pid) || true"
echo " kill \$(cat $LOGDIR/backend.pid) || true"
