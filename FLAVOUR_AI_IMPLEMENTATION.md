# Flavour AI implementation

The implementation follows the supplied Flavour AI specification and keeps the
existing Next.js UI, Express backend, PostgreSQL menu flow, React cart, and
checkout. No RAG, vector database, separate AI server, multi-agent system,
persistent customer memory, or autonomous order submission was added.

## Files created

- `backend/src/ai/agent.js`: validated `/api/ai/chat` streaming orchestration,
  bounded model steps, timeout/disconnect handling, friendly errors, and an SSE
  adapter over AI SDK's `fullStream`.
- `backend/src/ai/provider.js`: isolated Groq key/model configuration.
- `backend/src/ai/prompts.js`: grounding, constraints, session context, cart
  permissions, allergy safety, and checkout rules.
- `backend/src/ai/tools.js`: seven validated tools, authoritative summaries,
  budget checks, and approved browser actions.
- `backend/src/ai/validation.js`: bounded requests, filters, IDs, and quantities.
- `backend/src/menu.js`: menu access shared by the existing API and AI, including
  parameterized DB filtering and the existing memory fallback.
- `src/lib/cartActions.ts`: guards against stale/invalid browser cart actions.
- `src/lib/flavourAI.ts`: typed application events, incremental stream decoding,
  and friendly tool labels.
- `backend/test/ai.test.js`, `backend/test/frontend.test.js`: deterministic tests.
- Root and backend `.env.example`: placeholders only.
- This implementation report.

## Files modified

- `src/components/ui/ai-recommender.tsx`: evolved the existing entry point into
  Flavour AI with session history, streamed text, tools, real menu cards, starter
  prompts, retry/stop/new chat controls, cart summaries, and checkout handoff.
  Preserves dark/gold/saffron styling; adds mobile sizing, focus management,
  keyboard dismissal, and independent scrolling.
- `src/context/CartContext.tsx`: quantity-aware additions, immutable updates,
  synchronous snapshot access, idempotent action receipts, stale-cart guards,
  and authoritative menu-price refresh. One cart remains authoritative.
- `src/lib/useMenu.tsx`, `src/data/ambrociaMenu.ts`: retain spice metadata,
  preserve existing categories, and represent missing dietary metadata as unknown.
- `src/components/sections/MenuSection.tsx`, `src/components/ui/CartDrawer.tsx`:
  unknown dietary metadata is not treated as non-vegetarian.
- `src/components/sections/hero-section.tsx`: names the existing AI entry point
  Flavour AI.
- `src/components/sections/PunjabiSabjiCarouselSection.tsx`: resolves carousel
  additions against the active menu, including PostgreSQL numeric identities;
  reports dishes absent from an available backend menu instead of using a fake ID.
- `backend/src/index.js`: registers AI, shares menu access, preserves spice in
  admin sync, validates orders and recalculates authoritative prices/totals.
- `backend/src/menuData.js`: copies existing structured spice levels into existing
  menu records and includes the already purchasable Punjabi carousel dishes.
- `backend/src/seed.js`: preserves dietary, description, and spice fields in the
  existing menu table and closes the database pool.
- `backend/package.json`, `backend/Dockerfile`: AI dependency declarations, tests,
  and Node 22 runtime. Docker uses `npm install` because the new dependency lock
  could not be resolved in this restricted environment.
- `next.config.mjs`: forwards existing `/api/*` endpoints to Express.
- `.gitignore`: excludes nested dependencies and local service logs.
- `backend/README.md`: configuration, protocol, menu consistency, and test guidance.

## Dependencies and environment

Declared backend additions: `ai` (`^6.0.116`) and `@ai-sdk/groq` (`^3.0.0`).
The SDK's normal peer/transitive dependencies resolve through npm. No additional
framework or state library was introduced. These packages could not be installed
here: npm registry DNS is disabled and its cache lacks the packages. Consequently
`backend/package-lock.json` still needs regeneration with `npm install` in an
environment with registry access. Run the tests and full build again after that
installation. Node 22.18+ is required for the test command and `.env` loading.

Required AI variables in `backend/.env`: `GROQ_API_KEY`, `AI_MODEL`.
Existing optional variables: `DATABASE_URL`, `PORT`.
Root server-side variable: `BACKEND_URL` (defaults to `http://localhost:4000`).
No secrets were added to source files or examples.

## Tools, cart synchronization, and checkout

`search_menu`, `get_menu_item`, `get_cart`, `add_to_cart`, `update_cart`,
`remove_from_cart`, and `prepare_order` are implemented.

Each chat request includes only the current CartContext item IDs and quantities.
The backend resolves prices and details from the active menu. Cart tools produce
one validated pending action and stop the model. The browser rejects actions if
its cart quantity changed meanwhile, applies accepted actions once through
CartContext, records the result, and resumes with a fresh snapshot. The server
never maintains or mutates a second cart. Menu cards add directly through the
same CartContext. Summaries refresh browser item metadata from menu results.

`prepare_order` returns real line items, quantities, subtotal/total, unavailable
IDs, and checkout readiness. The button closes AI and opens the existing
CartDrawer. Customer details and Place Order remain in the existing checkout;
the model has no order submission tool. The order API also recalculates totals.

## Checks performed

Passed: 17 deterministic tests through `cd backend && npm test`.
Also passed JavaScript syntax checks and `git diff --check`.

Covered by tests:

- Real dish lookup; vegetarian/non-vegetarian, mild/spicy, category, maximum
  price, and combined filtering; nonexistent dishes and no-match constraints.
- Spice metadata copied from existing records and known carousel IDs.
- Rejection of malformed requests, caller system/tool roles, spoofed prices,
  invalid IDs, duplicate cart lines, invalid filters, and invalid quantities.
- Authoritative cart totals and additions/absolute updates/removals, fresh
  website snapshots, concurrent action exclusion, and stale browser guards.
- Whole-cart budget enforcement below ₹500; blocked additions/updates above it.
- Empty/unavailable cart readiness, structured order summaries, and no order tool.
- Existing order route: invalid item/quantity rejection, authoritative price and
  total recalculation, and preserved customer/order metadata (DB calls mocked).
- Parameterized PostgreSQL query generation, numeric price normalization, and
  unknown dietary/spice handling (DB query contract mocked).
- Streaming adapter and conversation forwarding (AI SDK mocked), hidden internal
  reasoning/arguments, structured tool failures, provider failures, and missing
  configuration.
- Incremental browser stream frames, split UTF-8 rupee text, completed actions
  retained before stream errors, truncated responses, and friendly HTTP errors.

Blocked checks:

- `npm run build` and `npm run lint`: `next: command not found`; frontend
  dependencies were not installed initially. Offline `npm ci` also failed because
  required tarballs are not cached (`zustand` was the first missing package).
- TypeScript check: TypeScript is not installed and is not available offline.
- Backend `npm start`: the sandbox rejects listening on port 4000 (`EPERM`).
- Real AI SDK/Groq runtime: package downloads are blocked and no
  `GROQ_API_KEY`/`AI_MODEL` configuration was available.
- Live PostgreSQL: no `DATABASE_URL` or local PostgreSQL server was available.
- Browser/mobile and actual checkout UI testing: frontend dependencies and
  listening ports are unavailable, so no browser test could be performed.

## Live acceptance scenarios still required

Once dependencies, a server-capable environment, and Groq credentials are
available, run the supplied manual checklist in full: real-dish, veg/nonveg,
spicy/mild/category/budget/combined searches; nonexistent dragon sushi; real
item details; meal under ₹500; vegetarian → spicy → under ₹300 follow-ups;
AI add → make two → inspect → remove; website add → AI inspect; order summary
→ existing checkout with explicit confirmation; peanut-allergy safety;
provider outage; and the full mobile open/close/scroll/input/stream/cards/cart/
checkout flow. Deterministic tests verify application behavior, but do not
establish real-model constraint retention or hallucination resistance.

Older PostgreSQL rows do not gain invented spice/diet data during reads. Include
real metadata and the carousel items in the normal menu sync when needed. The
existing seed/menu-sync operations replace menu contents and were not run on
any live database. Combined vegetarian/egg menu variants retain existing data
and are flagged for clarification in the prompt; restaurant curation is still
needed for unambiguous variant metadata.

Acceptance has not been fully verified due to these environment limitations.

## Dependency installation retry

After authorization to install all required development/testing dependencies,
attempted frontend `npm ci`, backend `npm install`, and Playwright/Chromium
installation. All three failed with `EAI_AGAIN` resolving `registry.npmjs.org`.
Even binding a temporary server to `127.0.0.1` was rejected with `EPERM`.
The existing 17 deterministic tests still passed. No AI/provider variables were
configured, and PostgreSQL tooling was unavailable. Network and local server
access are required before installation or live acceptance can proceed.
