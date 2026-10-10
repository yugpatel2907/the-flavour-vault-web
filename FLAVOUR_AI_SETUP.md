# Flavour AI: local setup and deployment

These instructions apply to the `ai-implementation` branch. All private values
are entered by you. The example files contain no credentials; do not commit
`.env`, `.env.local`, database URLs, or tokens.

## 1. What the existing website tells us

Public checks on October 10, 2026:

| URL | Result |
| --- | --- |
| https://the-flavour-vault-web-theta.vercel.app/ | 200: website loads |
| https://the-flavour-vault-web-theta.vercel.app/api/menu | 404: Next.js page, not menu JSON |
| https://the-flavour-vault-web-theta.vercel.app/api/restaurant | 404 |

The main frontend includes a bundled menu fallback. Seeing the menu on the
website does not establish that an Express backend or database is deployed.
The deployed public page bundle includes the old localhost:4000 API fallback
and no AI endpoint reference. It does not identify a hosted backend origin.
The README describes Railway for Express/PostgreSQL, but no actual backend
hostname or database provider is recorded in the repository. These public
checks cannot determine whether a separate, unconnected backend already exists.

The current architecture is Next.js on Vercel → an Express backend → PostgreSQL
when configured. The Vercel frontend does not start `backend/src/index.js` and
does not need database credentials. You can test locally before identifying
or provisioning any hosted service.

## 2. Create two local files privately

From the repository root, copy each example only if its destination is absent:

```bash
cd ~/projects/the-flavour-vault-web
test -f .env.local || cp .env.example .env.local
test -f backend/.env || cp backend/.env.example backend/.env
```

An existing root `.env.local` was detected during verification; it was not read
or modified. Check its `BACKEND_URL` yourself. Do not overwrite private settings.

### Root `.env.local`

```dotenv
BACKEND_URL=http://localhost:4000
```

### `backend/.env`: initial development without PostgreSQL

```dotenv
NODE_ENV=development
PORT=4000
DATABASE_URL=
DATABASE_SSL_MODE=verify-full
DATABASE_SSL_CA_FILE=
GROQ_API_KEY=
AI_MODEL=openai/gpt-oss-20b
ADMIN_MENU_SYNC_TOKEN=
```

Fill `GROQ_API_KEY` privately to test live AI. The other blank values can stay
blank for initial menu/chat/cart testing. Without `DATABASE_URL`, the existing
Express memory menu is authoritative; memory orders do not survive restarts.
Without an admin token, menu sync is disabled. No PostgreSQL installation or
new service is needed for this first development test.

### Where each value comes from

| Variable | How to get it |
| --- | --- |
| `GROQ_API_KEY` | Sign in to [Groq API Keys](https://console.groq.com/keys), create a key, and paste it only into `backend/.env` or the Express host's private variables. Do not send it in chat. |
| `AI_MODEL` | `openai/gpt-oss-20b` is a non-secret starting choice from Groq's [production model list](https://console.groq.com/docs/models); it supports [application tool calls](https://console.groq.com/docs/tool-use/overview). Check that your Groq account permits it. This is hosted by Groq and uses a Groq key, not an OpenAI key. |
| `DATABASE_URL` | Copy a connection URL from the database provider's connection/variables page. Use a separate test database locally and on Preview. Leave blank for initial development. |
| `DATABASE_SSL_MODE` | Keep `verify-full` for hosted databases. Only a local development/test PostgreSQL server without TLS may use `disable`. Deployed backends use `NODE_ENV=production` and verified TLS. |
| `DATABASE_SSL_CA_FILE` | Usually blank. If your provider uses a private CA, obtain its trusted CA PEM, mount/store it outside the repository, and enter its absolute backend file path. Never bypass certificate verification to fix a connection error. |
| `ADMIN_MENU_SYNC_TOKEN` | You generate this; it is not issued by Groq/Vercel. If admin sync is needed, run `openssl rand -hex 32` privately and put its output only in the backend configuration. Use different tokens for test and production. |
| `PORT` | `4000` locally. On a host, use the host-supplied port/target-port setting. |
| `BACKEND_URL` | `http://localhost:4000` locally. On Vercel, use the Express service's actual public HTTPS origin, without `/api`, credentials, or a query string. |

For Railway, a backend on Railway can use the database's internal connection
URL when its endpoint meets the TLS requirements. A computer outside Railway
needs the database's public TCP-proxy connection URL, typically
`DATABASE_PUBLIC_URL`; copy that privately into the application's `DATABASE_URL`.
A `*.railway.internal` address is not reachable from your laptop. See
[Railway PostgreSQL connections](https://docs.railway.com/databases/postgresql).

## 3. Install and start development

Use Node.js **22.18 or newer**. The Groq provider and AI SDK are already declared
in `backend/package.json`; no additional AI framework is needed.

```bash
cd ~/projects/the-flavour-vault-web
node --version
npm ci
npm ci --prefix backend
```

Terminal 1, from the repository root:

```bash
npm start --prefix backend
```

Terminal 2, from the same root:

```bash
npm run dev
```

Open http://localhost:3000. Restart the backend after editing `backend/.env`;
restart Next after editing `.env.local`. Startup automatically loads
`backend/.env` when run with the backend npm command.

Read-only smoke checks:

```bash
curl --fail http://localhost:4000/api/menu
curl --fail http://localhost:3000/api/menu
curl --fail http://localhost:3000/api/restaurant
```

These should return JSON, not an HTML fallback. In the browser, open Flavour AI
and try a starter prompt, "Vegetarian dinner under ₹300", then "Make it mild".
Check real cards, add/change/remove cart quantities, and checkout-summary handoff.
Do not press Place Order against a restaurant backend. Missing/invalid Groq
configuration must show a useful AI error while menu/cart remain usable.

Run the automated checks:

```bash
npm run lint
npm run typecheck
npm test --prefix backend
npm run build
npm ls --depth=0
npm ls --prefix backend --depth=0
git diff --check
```

For a local production-mode frontend, stop the dev frontend, then run
`npm run build` followed by `npm start`. Keep the local Express backend running.
This tests the optimized frontend, not the hosted production deployment.

PostgreSQL integration is a separate check. Use an empty/disposable test
database with approved menu data. **Do not run `npm run seed` or menu sync against
an unknown/existing production database: both replace the menu.** After privately
configuring `backend/.env` for your disposable database, you can deliberately
seed it from the repository root:

```bash
npm run seed --prefix backend
```

Initial memory-mode development does not require this command.

## 4. Find the existing backend, or create an isolated test deployment

1. In the Vercel dashboard, select the project serving your website. Inspect
   Settings → Environment Variables for `BACKEND_URL`. If present, its hostname
   identifies the configured backend; do not reveal any private variables.
2. Check your Railway account/projects, since the README names Railway. Select
   an Express service and look under Settings → Networking for its public domain.
   A PostgreSQL service is separate; its Variables/connection page contains the
   database URL. Railway is a documented option, not a verified current host.
3. If neither identifies a backend, check the accounts/deployment history of
   whoever originally deployed the site. A missing frontend API response alone
   cannot prove that no separate backend exists.
4. If no service exists, deploy the **existing** Express backend to a Node host
   such as Railway as an isolated test service. Use repository root directory
   `backend`, its existing Dockerfile (Node 22), and the feature branch. Generate
   a public HTTPS domain. No separate AI server or additional architecture is
   required. See [Railway Express deployment](https://docs.railway.com/guides/express).

Hosting accounts, service creation and private variables require your access.
No hosted service or deployment was created during this verification.

## 5. Vercel Preview and Production settings

The URL below is a placeholder: replace it with the actual Express service URL.
Do **not** use the Vercel frontend URL as `BACKEND_URL`.

| Environment | Vercel frontend variables | Express backend variables |
| --- | --- | --- |
| Preview | `BACKEND_URL=<actual test Express HTTPS origin>` scoped to Preview | `NODE_ENV=production`, `GROQ_API_KEY=<private test key>`, `AI_MODEL=openai/gpt-oss-20b` (account-enabled), `DATABASE_URL=<separate test PostgreSQL URL>`, `DATABASE_SSL_MODE=verify-full`, optional `DATABASE_SSL_CA_FILE=<mounted trusted CA path>`, `ADMIN_MENU_SYNC_TOKEN=<private test token>` if sync needed; host-supplied `PORT` |
| Production | `BACKEND_URL=<actual production Express HTTPS origin>` scoped to Production | `NODE_ENV=production`, `GROQ_API_KEY=<private production key>`, `AI_MODEL=<validated production model>`, `DATABASE_URL=<production PostgreSQL URL>`, `DATABASE_SSL_MODE=verify-full`, optional trusted CA path, private production admin token if sync needed; host-supplied `PORT` |

Use Vercel's Next.js preset with repository root `.`, `npm ci`, and
`npm run build`, and a Node.js 22 runtime. Add variables separately to Preview and Production and redeploy
after changes; the proxy origin is chosen at build time. See
[Vercel environment scopes](https://vercel.com/docs/environment-variables).
Groq/database/admin secrets belong only to Express; never use `NEXT_PUBLIC_*`.
Actual production orders need durable PostgreSQL, not the memory fallback.

Next.js 16.4.0 and compatible React/renderer dependencies are now installed;
lint, typecheck, 31 automated tests and production build pass. Before production,
complete the remaining live checks in
[FLAVOUR_AI_VERIFICATION.md](./FLAVOUR_AI_VERIFICATION.md). Check the
latest security advisory again at deployment time. On an isolated Preview,
verify menu JSON, streaming, session follow-ups, cards, shared cart quantities,
mobile behavior, and that preparing checkout sends no order request. Use a test
backend and intercept order submission rather than placing real orders. Verify
the real PostgreSQL TLS connection and graceful behavior when Groq is unavailable.

You do not need n8n, LangChain, RAG, a vector database, persistent AI memory,
or another AI server to run this project.
