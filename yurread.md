# Quick Run & Deploy Instructions — Thar / Ambrocia's

This file collects all commands to run this project locally (frontend + backend), seed the database, and common troubleshooting steps.

Paths
- Repository root: `/home/yugpatel/the-flavour-vault-web`
- Frontend (Next.js): repository root
- Backend (Express): `/home/yugpatel/the-flavour-vault-web/backend`

1) One-line helper (recommended)

From the repository root run the helper script which installs (if needed), optionally seeds Postgres and starts frontend + backend in background with logs in `.local-logs`:

```bash
cd /home/yugpatel/the-flavour-vault-web
chmod +x run-local.sh
./run-local.sh            # start both (no DB seed)
# or seed (after exporting DATABASE_URL):
export DATABASE_URL="postgres://user:pass@host:5432/dbname"
./run-local.sh --seed

# Logs
tail -f .local-logs/backend.log
tail -f .local-logs/frontend.log

# Stop
kill $(cat .local-logs/frontend.pid) || true
kill $(cat .local-logs/backend.pid) || true
```

2) Manual — Run frontend and backend in foreground (two terminals)

Terminal A — Backend
```bash
cd /home/yugpatel/the-flavour-vault-web/backend
npm install
# Optional: seed Postgres
# export DATABASE_URL="postgres://user:pass@host:5432/dbname"
# npm run seed
npm start
# or: node src/index.js
# Backend API: http://localhost:4000
```

Terminal B — Frontend
```bash
cd /home/yugpatel/the-flavour-vault-web
npm install
npm run dev
# Frontend: http://localhost:3000
```

3) Production build & run (frontend)

```bash
cd /home/yugpatel/the-flavour-vault-web
npm run build
npm start    # requires build step first
```

4) Docker (backend)

Build and run backend container (example):

```bash
cd /home/yugpatel/the-flavour-vault-web/backend
docker build -t ambrocia-backend .
docker run -p 4000:4000 -e PORT=4000 -e DATABASE_URL="$DATABASE_URL" ambrocia-backend
```

5) Admin: Sync menu from JSON

POST `/api/admin/menu-sync` with body `{ "menu": [ { name, category, price, isVeg, description }, ... ] }`.

Example curl to sync:

```bash
curl -X POST http://localhost:4000/api/admin/menu-sync \
 -H 'Content-Type: application/json' \
 -d '{"menu":[{"name":"Veg Biryani","category":"biryani","price":160,"isVeg":true,"description":"..."}]}'
```

6) APIs
- GET `/api/menu` — returns menu items
- GET `/api/restaurant` — restaurant info
- POST `/api/orders` — submit order (items, customer.phone, order_type, address/table_number, total)

7) Troubleshooting
- If `next: command not found` after `npm run dev`: ensure `npm install` completed successfully in repo root.
- If `Error: listen EADDRINUSE: address already in use :::4000` — port 4000 taken. Find and kill the process:

```bash
ss -ltnp | grep ':4000' || sudo lsof -nP -iTCP:4000 -sTCP:LISTEN
kill <PID> || kill -9 <PID>
```

- If backend complains `Cannot find module 'express'` — run `npm install` inside `/backend`.
- Use `tail -f .local-logs/backend.log` and `tail -f .local-logs/frontend.log` to inspect background-started logs.

8) Verify endpoints

```bash
curl http://localhost:4000/api/menu | jq . | head -n 20

curl -X POST http://localhost:4000/api/orders \
  -H 'Content-Type: application/json' \
  -d '{
    "items":[{"id":"b1","name":"Veg Biryani","price":160,"quantity":1}],
    "customer":{"phone":"+919876543210","address":"Chennai"},
    "order_type":"delivery",
    "total":160
  }'
```

9) Notes
- The frontend includes a lightweight Three.js hero; it is lazy-loaded for performance.
- SEO: site contains JSON-LD for restaurant and menu items, and an OG image at `/public/og-image.svg`.

If any command fails, copy the terminal log output (or the last 40 lines from the log files) and paste it here — I will provide the exact fix.
