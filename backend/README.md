# Flavour Vault Backend (Railway-ready)

This simple Node/Express backend serves menu and restaurant info and accepts orders.

Quick start (local, no DB):

1. cd backend
2. npm install
3. npm start

Endpoints:
- `GET /api/menu` — returns menu items
- `GET /api/restaurant` — restaurant info and contact
- `POST /api/orders` — accept order payload `{ items: [...], customer: {...}, total }`

Using Postgres (recommended on Railway):
1. Create a Railway project and add a Postgres plugin.
2. Copy the generated `DATABASE_URL` value into Railway environment variables (and into your local `.env` for local testing).
3. Run `npm run seed` to populate the `menu` table.
4. Start: `npm start` — the server will use the Postgres DB when `DATABASE_URL` is present.

Environment variables:
- `DATABASE_URL` — Postgres connection string (Railway provides this)
- `PORT` — port to listen on (default 4000)

Notes:
- The server falls back to in-memory data if no `DATABASE_URL` is provided — useful for local dev when you don't want to provision a DB.

Admin: Sync menu data
---------------------

You can push the full product/menu data (JSON array) to the backend so it becomes the canonical source of truth.

POST /api/admin/menu-sync
- body: `{ "menu": [ { name, category, price, isVeg, description }, ... ] }`
- When `DATABASE_URL` is present the endpoint will write the items into Postgres `menu` table (it will create/truncate the table).
- When no DB is configured the server will update an in-memory menu used by `GET /api/menu`.

This is useful to sync frontend `ambrociaMenu` into the backend database or to integrate a headless CMS: export menu JSON from the CMS and POST it to this endpoint.
