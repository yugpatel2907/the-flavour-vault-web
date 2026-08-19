# The Flavour Vault — Ambrocia's (Monorepo)

This repository contains a Next.js frontend and a small Node/Express backend for Ambrocia's Restaurant demo (digital marketing course project).

Quick start (frontend)

1. Install dependencies and run the Next dev server:

```bash
cd /home/yugpatel/the-flavour-vault-web
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` by default.

Backend (local)

1. Start the backend API (port 4000):

```bash
cd backend
npm install
# optional: set DATABASE_URL for Postgres and seed
# export DATABASE_URL="postgres://..."
# npm run seed
npm start
```

API
- `GET /api/menu` — fetch menu items
- `POST /api/orders` — submit an order
- `POST /api/admin/menu-sync` — admin endpoint to sync menu JSON into the backend

Deploying

Frontend (Vercel)
- Create a Vercel project pointing to this repository; Vercel will detect Next.js and deploy automatically.
- Set any environment variables under Vercel Project Settings if needed.

Backend (Railway)
- Create a Railway project and add a Postgres plugin.
- Set the `DATABASE_URL` Railway provides as an environment variable.
- Deploy by connecting the repo (or push a branch) or deploy using a Dockerfile.

Docker (backend)
- A `backend/Dockerfile` is included to build an image you can deploy to Railway, Heroku, or other container platforms.

Notes
- The frontend contains a lightweight 3D hero built with React Three Fiber; it is lazy-loaded and optimized for performance.
- SEO: site includes page metadata and JSON-LD for the restaurant and menu items.
