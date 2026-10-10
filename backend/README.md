# Flavour Vault Backend (Railway-ready)

This simple Node/Express backend serves menu and restaurant info and accepts orders.

For complete Flavour AI env templates and deployment steps, see
[FLAVOUR_AI_SETUP.md](../FLAVOUR_AI_SETUP.md). Initial development needs no database.

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
2. Configure the backend's private `DATABASE_URL`; local testing outside Railway needs its public connection URL, not an internal hostname. Use a separate test database.
3. Populate only a disposable/approved database. The seed replaces the menu; do not run it against an unknown or production database. From `backend/`, `npm run seed` loads your private local `.env` configuration.
4. Start: `npm start` — the server will use the Postgres DB when `DATABASE_URL` is present.

Environment variables:
- `DATABASE_URL` — Postgres connection string (Railway provides this)
- `PORT` — port to listen on (default 4000)
- `NODE_ENV` — `development` locally, `production` on deployed Preview and Production backends (already set by Docker)
- `DATABASE_SSL_MODE` — defaults to `verify-full`, verifying the certificate chain and hostname. `disable` is accepted only with `NODE_ENV=development` or `test`, for a local database without TLS.
- `DATABASE_SSL_CA_FILE` — optional mounted provider CA PEM path when the database uses a private CA. Leave unset for system CA trust; this setting also works in local backend/.env.
- `ADMIN_MENU_SYNC_TOKEN` — private, high-entropy admin bearer token. Missing configuration disables menu sync.

Connection-string `ssl*` and `uselibpqcompat` parameters are removed before pg
parses the URL, so they cannot override the TLS policy. `PGSSLMODE` also cannot
override it. Configure TLS using the variables above. Deployed PostgreSQL must
support TLS and provide a certificate valid for its connection hostname. For a
private CA, mount the provider's trusted CA file and set `DATABASE_SSL_CA_FILE`
before starting the backend; never solve certificate errors by disabling verification.

Notes:
- The server falls back to in-memory data if no `DATABASE_URL` is provided — useful for local dev when you don't want to provision a DB.

Admin: Sync menu data
---------------------

You can push the full product/menu data (JSON array) to the backend so it becomes the canonical source of truth.

POST /api/admin/menu-sync
- header: `Authorization: Bearer <ADMIN_MENU_SYNC_TOKEN>` (from a trusted admin client over HTTPS, never browser code)
- body: `{ "menu": [ { name, category, price, isVeg, description }, ... ] }`
- When `DATABASE_URL` is present the endpoint will write the items into Postgres `menu` table (it will create/truncate the table).
- When no DB is configured the server will update an in-memory menu used by `GET /api/menu`.

This is useful to sync frontend `ambrociaMenu` into the backend database or to integrate a headless CMS: export menu JSON from the CMS and POST it to this endpoint.

Generate the token privately with at least 32 random bytes and configure it only
on the Express host (or local `backend/.env`). Missing/malformed/wrong authorization
returns 401 before any menu writes; an authorized-shaped request with missing
server configuration returns 503. Token hashes are compared in constant time.
Existing payload validation and sync behavior are preserved. Use a disposable
test database for verification; sync replaces the menu.

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

## Final verification

Dependency locks now include the compatible AI SDK/Groq packages; Docker uses
`npm ci --omit=dev` and excludes env files and node_modules from its build context.
See `../FLAVOUR_AI_VERIFICATION.md` for the current checks, local
configuration, Preview/Production setup, and remaining blockers. The earlier
implementation report records historical limitations, not the latest status.
