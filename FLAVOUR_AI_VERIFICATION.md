# Flavour AI verification — single Next.js application

Updated 2026-10-14. Branch: `ai-implementation` (tracking
`my-vercel/ai-implementation`); working tree was clean before the October 13
single-app migration. October 14 cleanup preserves those uncommitted changes.
The user's latest instruction replaces the separate Express/PostgreSQL deployment
requirement. The user explicitly selected **clearly labelled demo checkout**.
The earlier two-service verification/setup requirements are superseded.

No real env file, API key, database, order, reservation, payment, commit, merge,
push or deployment was created. Existing root `.env.local` and legacy backend
`.env` files were preserved without reading or changing them. Fixture checks
disable real keys.

## A. Files changed

- `src/app/api/ai/chat/route.ts`, `src/server/ai/{agent,provider,prompts,tools,validation}.js`:
  same AI SDK/Groq integration and seven validated tools in the Next.js Node
  runtime. Native Request/Response SSE transport, bounded JSON body, sanitized
  errors, timeout/cancellation and per-instance concurrency limit. No Express/PG
  dependency. Tools/provider validation were reused, not rebuilt.
- `src/data/menu.ts`, `src/server/menu.js`, `src/app/api/menu/route.ts`,
  `src/lib/useMenu.tsx`: one authoritative catalog combining the existing menu and
  carousel records. Normal UI, API, AI and cart agree without an external fetch
  or database. Preserves all 122 real existing dish IDs/prices/spice levels.
- `src/data/ambrociaMenu.ts`: four combined veg/egg records now have unknown diet
  rather than declaring every variant vegetarian. No nutrition/allergens invented.
- `src/data/punjabiSabjiData.ts`: type-only UI import (no server import of client
  carousel), and explicit existing diet/spice types for shared menu use.
- `src/components/ui/CartDrawer.tsx`: existing review/customer/quantity flow,
  explicitly demo completion with no HTTP call, storage, charge or fake order ID.
  Cart remains intact. Close resets checkout review; control labels/dialog added.
- `src/components/ui/ai-recommender.tsx`: footer accurately states demo checkout;
  working chat/cards/CartContext/summary handoff retained.
- `src/components/sections/FooterReservation.tsx`, `hero-section.tsx`,
  `src/components/ui/order-tracker.tsx`: existing demo interactions/animations
  preserved with honest reservation/tracking labels and restaurant contact.
- `next.config.mjs`: removes external backend rewrites and BACKEND_URL requirement;
  removes now-unused Three.js transpilation/externals configuration while retaining
  the existing React mounting behavior.
- `package.json`, `package-lock.json`: AI dependencies in the root, root test
  command and Node minimum. `tsconfig.json`: allows explicit TS data imports for
  both Next and credential-free native Node tests.
- `test/{ai,frontend,react-render,sdk-runtime,server,dependencies}.test.js`,
  `test/chat-fixture.js`: migrated all applicable AI/React/browser-parser/cart
  tests to root plus new single-app transport/security/dependency tests. All 29
  applicable root tests are retained. Obsolete PostgreSQL/order/admin tests were
  removed with the unused backend; their earlier results are historical only.
- `.env.example`, `README.md`, `FLAVOUR_AI_SETUP.md`: active one-app setup with
  obsolete Express-origin comments removed from the root env example.
- `run-local.sh`: single foreground development server, no backend/seed startup.
- Removed `scripts/upgrade-next.mjs`, the completed one-time framework migration
  script, and `yurread.md`, which duplicated the maintained setup instructions.
- `.gitignore`: verification report is now reviewable/versionable; all `.env.*`
  variants are ignored except `.env.example`. `FLAVOUR_AI_VERIFICATION.md`: this
  current report.
- `src/app/page.tsx`, `src/components/ui/Preloader.tsx`, `hero-section.tsx`:
  remove the null canvas mount, unused completion state/callback and unused hero
  props. The preloader still runs its existing curtain/progress animation.
- `src/app/globals.css`, `tailwind.config.js`: remove three unreferenced CSS
  helpers and the content glob for the nonexistent `src/pages` directory.

Cleanup removed the unused backend sources, Docker configuration, lockfile and
762 tracked `backend/node_modules` files. Its private ignored `.env` is preserved
locally without opening it; no backend files belong in the commit. The old
menu-sync/order endpoints remain absent from the deployment.

The source import graph confirmed 26 unreachable components/helpers/shaders.
Those files and the mounted `SceneCanvas` placeholder (which returned `null`)
were removed. This includes the unused alternate hero, both unused Lenis
providers, unused 3D scenes, cursor/modal placeholders and duplicate SEO helper.
The active hero, background, carousel, preloader, audio, animations and layout
SEO remain. Removed the unused preloader completion callback/state and hero
props. The root `menu.png` was byte-identical to `public/menu.png`; only the
unused root copy was deleted. The served menu image remains unchanged.
No CartContext replacement or visual redesign was made.

Generated verification logs, four tracked runtime log/PID files, temporary
Playwright tooling/screenshots and the old generated `/tmp` checkout were deleted
after the final browser/HTTP checks. `.local-logs/` remains ignored.
The current ignored build and installed app dependencies are retained so local
development and `npm start` remain usable. Browser binaries in the user cache
were left available for future testing. No Git commit was created.

## B. Dependencies and security

| Root dependency | Version | Change |
| --- | --- | --- |
| `ai` | 6.0.301 | Same previously tested SDK, now installed in main app |
| `@ai-sdk/groq` | 3.0.72 | Same compatible provider, now installed in main app |
| `server-only` | 0.0.1 | Marks the Next AI route's server boundary |
| Next / React / ESLint | Existing versions retained | No new upgrade |
| `@react-three/drei`, `@react-three/fiber`, `three`, `@types/three`, `lenis` | Removed | Only imported by unreachable code |

Root `npm ls --depth=0` and actual SDK/Groq fixture tests pass. Lock generated
with npm and clean `npm ci` verified. No peer overrides, weakened assertions,
new AI framework, database, separate AI server, RAG, vector DB, n8n, persistent
memory or multi-agent architecture added. npm removed 56 installed packages
after removing the five unused direct dependencies. Active Framer Motion, GSAP,
Lucide, styling utilities, React and AI packages are retained. Temporary browser
tools are not application dependencies and are removed after verification.

Server configuration stays in the Next Node route. Browser build chunks contain
no GROQ_API_KEY, Groq API origin, DATABASE_URL or admin token. The AI deployment
trace contains no legacy backend files. Only seven narrow application tools are
registered. They cannot execute SQL, files, arbitrary HTTP/JavaScript, DB writes,
order creation or payments. Groq's built-in execution/browser tools are not used.
JSON-only input preserves the previous endpoint's media-type boundary; body is
limited to 100 KiB, roles/IDs/quantities/tool fields are strictly validated.

## C. Exact environment variables

Only two settings enable live AI; ordinary menu/cart/demo functions need none.

| Variable | Local development | Vercel Preview | Vercel Production |
| --- | --- | --- | --- |
| `GROQ_API_KEY` | Root `.env.local`: fill private key yourself | Private test key, Preview scope | Private production key, Production scope |
| `AI_MODEL` | Root `.env.local`: `openai/gpt-oss-20b` or account-enabled tool-capable model | Same tested model ID | Validated production model ID |

Get a private key from [Groq](https://console.groq.com/keys); current models are
listed in [Groq model docs](https://console.groq.com/docs/models). No public
NEXT_PUBLIC key, BACKEND_URL, DATABASE_URL, backend/.env, PORT, admin secret,
PostgreSQL service or Railway deployment is required. Hosts set NODE_ENV/PORT
for Next normally; do not add them to the private root env template.

The obsolete backend env example was removed. Do not create a backend env file
to run this website. Existing private files are untouched and remain ignored.

## D. Commands run / repeat locally

Use Node 22.18+ (this environment: Node 26.7.0/npm 12.0.2). From repository root:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm ls --depth=0
npm run build
npm run dev
```

Use `npm start` instead of dev to serve a completed production build. Only one
server is needed. `./run-local.sh` starts dev in foreground; Ctrl+C stops it.
Create/edit root `.env.local` privately only if you want live Groq.

Verification also ran: npm root SDK install and offline lock regeneration;
clean copied checkout `npm ci --offline` with **no backend folder or real env**;
lint/typecheck/tests there; `VERCEL=1 GROQ_API_KEY= AI_MODEL= npm run build` there;
working-repo production build; JS `node --check`; `bash -n run-local.sh`;
`git diff --check`; manifest/lock/installed version assertions; browser-bundle
and deployment-trace checks; local production HTTP checks.

October 14 cleanup reran `npm uninstall @react-three/drei @react-three/fiber
three @types/three lenis --offline --no-audit --no-fund`, followed by a clean
`npm ci --offline --no-audit --no-fund`. Then lint, typecheck, all root tests,
dependency listing, 17 JS/config syntax checks, shell syntax, whitespace checks
and the final production build passed. Real provider variables were empty for
tests/build and the missing-config browser server. A separate HTTP fixture
server used only a dummy key and intercepted Groq transport. Both local
verification servers were stopped afterward.

The final source graph has 38 files, all reachable from app entry points, with
no unresolved local imports. All 22 browser JS chunks were checked for private
provider/backend configuration and removed Three.js dependencies; none were
present. The AI deployment trace contains no backend files.

Actual Next production HTTP streaming additionally exercised all seven tools through
the installed Groq provider using a test-only Node HTTP preload. This is not loaded
by application/deployment code; no real provider request or credential was used.
The SDK stopped after cart actions; real menu prices, filters, summaries and history
passed across the actual Next.js HTTP route.

Before cleanup, all 31 legacy backend tests passed with provider/DB/admin values
explicitly empty and fixture writes only. The unused backend and these old
service-specific tests are now removed; they are not current app requirements.

## E. Passed checks

| Check | Result |
| --- | --- |
| Clean main-app dependency install without backend | 405 packages installed from final lock; previous env-free checkout also passed |
| Root dependency/module/lock consistency | Passed |
| Lint | Passed, 0 errors / 4 pre-existing image warnings |
| Typecheck | Passed |
| Root AI/SDK/cart/parser/React/transport/security tests | 29/29 passed |
| Legacy backend regression suite | 31/31 passed before cleanup; obsolete service removed |
| JS/config syntax | 17 files passed after cleanup |
| Shell helper syntax | Passed |
| Production build | Final cleaned root passed on Next 16.4.0; earlier env-free Vercel-mode checkout also passed |
| Browser bundle/server trace separation | Passed; no private provider config/backend dependency |
| Single-app production HTTP | Home 200; exact shared 122-item menu 200; AI 503 without config; invalid input 400/413/415; GET AI 405 |
| Unused order/admin endpoints | 404; no external proxy/service used |
| Actual Next HTTP SSE with installed Groq SDK and all seven tools | Passed using test-only intercepted HTTP; no live provider/key |
| Interactive Chromium desktop + 390×844 mobile | Passed: menu/cart/AI/demo interactions; no uncaught errors or order/admin requests |
| Git whitespace/private env exclusions | Passed |

The original frontend has 114 dishes, plus 8 existing Punjabi carousel dishes.
The old backend copy omitted `ns22` (Crab Lollipop / Fish Finger, ₹310); reusing
frontend data preserves it rather than inventing/losing items. All have existing
valid spice data. Diet for combined veg/egg records remains unknown.

### Browser runtime evidence

Real Chromium was downloaded into the user cache and used with software WebGL.
The application ran from the clean Next-only production checkout (no backend,
no real env file) during the migration. October 14 reran the same desktop
(1440×1000) and mobile (390×844) suite against the final cleaned root production
build, with live AI credentials explicitly disabled. Both passed:

- Actual missing-config endpoint, starter prompt and retry show a useful error;
  normal website/menu/cart remain usable.
- Menu search/Add to Order, quantity increase/decrease and authoritative totals.
- Delivery/dine-in demo completion, clear no-submission messaging, retained cart,
  and cart review after closing/reopening.
- Controlled SSE recommendation cards/Add to Cart, session follow-up history,
  add/update/get/remove through real CartContext, summary → existing CartDrawer.
- Existing reservation/tracking demos remain functional with honest labels.
- Mobile panel fits viewport, card add/cart removal work, no horizontal page overflow.
- 12 fixture chat requests; no uncaught page errors; no order/admin HTTP requests.

Browser UI tests use controlled responses, not a live model. Actual server/SDK SSE
is separately verified through the real HTTP endpoint, including a successful
October 14 rerun of all seven tools. Screenshots were visually reviewed during
the migration; temporary harness/results were ignored under
`.local-logs/browser-check/` and were removed after the cleanup runtime checks.
No Playwright dependency was added to the app. The full Chromium binary was used;
the additional unused headless-shell download was stopped after Chromium installed.

## F. Environment limits and unfinished external checks

- Live Groq account/model permissions, quota, natural-language adherence and real
  internet streaming require the user's private key. No secrets were inspected.
  Installed SDK/provider behavior is tested with controlled model/HTTP transports.
- Vercel Preview/Production streaming requires the user's project settings and
  deployment. No deployment, dashboard access or production traffic was attempted.
- Sandbox DNS and local socket restrictions initially blocked SDK/browser downloads,
  builds and HTTP tests. Approved execution resolved installation/build/HTTP issues;
  application config was not changed to hide sandbox failures. The build's empty
  TypeScript --showConfig subprocess output only occurred inside the sandbox.
- Real database/TLS/persistence and Docker checks are no longer acceptance
  requirements for the selected architecture. There is no database in runtime.

## G. Remaining manual acceptance

With your private root key, then in Preview:

1. Real streaming and starters; retain vegetarian → spicy → under ₹300 context.
2. Category/diet/spice/price filters, meal under ₹500, real item details and
   nonexistent "dragon sushi". All cards/prices must match `/api/menu`.
3. Allergy question must express uncertainty; never claim allergy/health safety.
4. AI add → update → inspect → remove and normal cart edits; real totals/IDs agree.
5. Prepare summary → cart review; demo completion sends/stores nothing and retains
   the cart. Use dummy customer details. No restaurant order/payment can be made.
6. Phone-sized panel, scroll/focus/stop/retry; provider failure keeps site usable.
7. Check the existing carousel/animations on a real device and confirm
   no console exceptions. Controlled browser checks do not prove live model text.

## H. Exact Vercel Preview setup

One existing Vercel project, root directory `.`, Next.js preset, Node 22.x,
install `npm ci`, build `npm run build`, default Next.js output directory.
Private Preview `GROQ_API_KEY` plus Preview `AI_MODEL`. Redeploy after changes.
No backend host/origin, PostgreSQL URL, admin token, port or CORS change needed.
Do not use static export: the server AI route is required to protect the key.

The Node streaming route has `maxDuration=65` and a 60-second application timeout.
Confirm plan/project duration permits it; enable Fluid compute if legacy plan
limits are lower. See [Vercel duration](https://vercel.com/docs/functions/configuring-functions/duration)
and [streaming](https://vercel.com/docs/functions/streaming-functions).
Verify menu JSON and real streaming in Preview before production.

## I. Exact Vercel Production setup

Same project/settings, with private Production `GROQ_API_KEY` and tested
Production `AI_MODEL`; redeploy. No committed env or local file is needed.
Menu data ships with the app. Changing dishes/prices requires updating the real
catalog and redeploying; no database/admin sync is present in this architecture.
Use separate test/production keys where practical; review provider quota/spend.

Production remains an explicitly labelled demo for checkout/reservations/tracking.
Durable restaurant order processing/payment was not requested and is not faked.
Check latest Next security advisories at actual deployment time; framework version
was preserved during this focused architecture change.

## J–K. Merge status / remaining risks

**MERGE STATUS: READY** for the user-selected single-app/demo architecture.

All known code-level blockers are resolved: root install, lock/module checks,
lint, typecheck, 29 root tests, production/Vercel-mode
builds, actual HTTP/SDK streaming, and desktop/mobile browser interactions pass.
The old backend/database hosting dependency is eliminated. No remaining known
code blocker was found.

Live Groq model/account behavior and deployed Vercel streaming still require your
private configuration and Preview acceptance before production release. Physical
device behavior also deserves a final manual check. This merge status does not
claim those external production checks have been completed. The branch was not
merged, pushed or deployed.

Existing warnings: four `<img>` performance notices, metadataBase warning in
local build, ESLint 9 deprecation/optional resolver installation notice, Node's
native TS module-type warning. None suppressed; checks pass. The concurrency
limit is per server instance, not a global account quota. Prompts/fixtures cannot
guarantee every live model text response; authoritative cards/actions/totals and
validated tools provide the factual/action boundaries. No persistent customer
memory or real order storage was introduced.
