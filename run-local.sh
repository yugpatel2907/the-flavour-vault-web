#!/usr/bin/env bash
set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"
if [ "$#" -ne 0 ]; then
  echo "Usage: ./run-local.sh (one Next.js server; no backend or database seed needed)" >&2
  exit 1
fi
if [ ! -d node_modules ]; then
  npm ci
fi
exec npm run dev
