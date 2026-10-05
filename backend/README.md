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

## Flavour AI

Use Node.js 22.18 or newer. Install dependencies with `npm install` (from
`backend/`), copy `.env.example` to `.env`, and set `GROQ_API_KEY` and `AI_MODEL`
to a currently available Groq model that supports function calling. These values
are server-side only. AI SDK 6 and its compatible Groq 3 provider are used with
the existing JavaScript backend. Startup reads `backend/.env` when run here.

`POST /api/ai/chat` accepts:

```json
{
  "messages": [{ "role": "user", "content": "Vegetarian dinner under ₹300" }],
  "cart": [{ "itemId": "b1", "quantity": 1 }]
}
```

It uses AI SDK `streamText` and adapts `fullStream` to SSE `data:` events:
`text`, `tool-state`, `tool-result`, `error`, and `done`. Internal reasoning and
raw tool arguments are omitted. Only user/assistant text history is accepted;
prices or caller-supplied system/tool messages cannot be authoritative.

The seven tools are `search_menu`, `get_menu_item`, `get_cart`, `add_to_cart`,
`update_cart`, `remove_from_cart`, and `prepare_order`. Search is performed by
parameterized PostgreSQL queries, or the existing in-memory menu fallback.
An action stops the model loop. The browser applies it through CartContext,
records its receipt, and resumes with a fresh ID/quantity snapshot. Quantities
are limited to 1–50. Add/update tools accept an optional `maxTotal` to enforce a
requested complete cart budget using menu prices. Order preparation never
invokes the order API. Existing checkout still requires customer details and
an explicit Place Order click. `/api/orders` now also validates menu IDs and
quantities and recalculates prices and totals instead of trusting the browser.

The menu API, seed, and admin sync preserve real `spicyLevel` values. Older DB
rows with absent spice/diet metadata remain unknown and do not match those
filters. `ensureMenuSchema` adds nullable menu fields only during explicit seed
or menu sync; normal reads do not alter the DB. No AI tables are created. The
existing seed and menu-sync operations replace menu contents: use them only
when you intend to replace the menu. Numeric PostgreSQL IDs are retained;
in-memory mode retains the menu's string IDs. All AI lookups use whichever
IDs `/api/menu` currently returns.

The existing Punjabi carousel records are now also in `menuData.js`, preserving
its item IDs and prices. Existing databases need those real records included in
their normal menu sync to support authoritative inspection of carousel orders.
Records that combine vegetarian and egg variants still need restaurant curation;
the assistant is instructed to clarify the requested variant.

The Next.js app proxies `/api/*` to the Express backend. Set server-side
`BACKEND_URL` in the root `.env.local` for a deployed backend (default:
`http://localhost:4000`). No provider key is needed in frontend configuration.

Run `npm test` here for tool, validation, streaming adapter, browser stream/parser,
cart guard, budget, PostgreSQL query-contract, and existing order-route tests.
These deterministic tests do not require Groq credentials or a PostgreSQL server.
See `../FLAVOUR_AI_IMPLEMENTATION.md` for verification status and the remaining
live acceptance scenarios.
