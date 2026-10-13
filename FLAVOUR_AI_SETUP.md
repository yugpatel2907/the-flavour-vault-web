# Flavour AI — one application setup

Updated 2026-10-14. These instructions replace the earlier Express/PostgreSQL
setup. The user selected demo checkout. The current site requires **no separate
backend, database or backend environment file**. Next.js server routes keep the
Groq credential private in the same app that Vercel deploys.

## 1. Install and run

From `/home/yashas/projects/the-flavour-vault-web`, use Node 22.18+:

```bash
npm ci
npm run dev
```

Open http://localhost:3000. The ordinary website, menu and cart work with no env
file. Missing AI configuration gives a friendly error in Flavour AI.

## 2. The only local env file

Create **`.env.local` in the repository root** privately. If it already exists,
edit it yourself; do not overwrite it blindly. It is ignored by Git.

```env
GROQ_API_KEY=<your private Groq key>
AI_MODEL=openai/gpt-oss-20b
```

Replace the key placeholder yourself. Obtain it from the
[Groq API keys page](https://console.groq.com/keys). The model ID is non-sensitive;
Groq lists `openai/gpt-oss-20b` as a production model in its
[model documentation](https://console.groq.com/docs/models). Verify that your
account permits this model and has available quota; another account-enabled
Groq model with function calling can be configured. No OpenAI API key is needed.
Restart the local server after editing env settings.

Never use `NEXT_PUBLIC_GROQ_API_KEY` or any other public name for credentials.
Do not create `backend/.env`, PostgreSQL, a Railway service, admin secret or
`BACKEND_URL` for the current application. Old private backend settings, if you
already have them, are ignored by this app; you can remove them yourself.

## 3. Local verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Use `npm run dev` OR `npm start`, not both on the same port. `npm start` requires
the successful production build. The root tests use controlled models/HTTP
fixtures, not live credentials or a database. The unused legacy backend and its
service-specific tests were removed; all applicable AI/cart/React tests are in
the root `test/` directory.

Test starters, vegetarian → spicy → under ₹300 follow-ups, real dish details,
meal under ₹500, missing dishes, allergy uncertainty, AI add/update/remove, normal
cart edits and summary → checkout handoff. Check phone-sized UI, stop/retry and
provider failure. Checkout is a demo: use dummy details, not real personal data.
Completing it sends nothing, takes no payment, and leaves the cart intact.
Reservation/tracking widgets are also labelled demos. There is no real order
tracking or durable order/reservation storage in this architecture.

## 4. Vercel Preview

In the existing Vercel project:

1. Use **Next.js**, root directory `.`, Node.js **22.x**, install `npm ci`, build
   `npm run build`, default Next.js output directory.
2. In Settings → Environment Variables, add these scoped to **Preview**:
   - `GROQ_API_KEY`: your private test Groq key.
   - `AI_MODEL`: `openai/gpt-oss-20b`, or your validated function-calling model.
3. No backend origin or database settings are needed. An old `BACKEND_URL` is
   unused. Do not add public secret variables or use static HTML export.
4. Create/redeploy a Preview from the feature branch through your normal Vercel
   workflow. Verify `/api/menu` returns JSON, and `/api/ai/chat` streams in the
   browser. Repeat all local acceptance scenarios. No orders can be placed here.

Next.js [route handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route)
use Web Request/Response; Vercel supports
[streaming functions](https://vercel.com/docs/functions/streaming-functions).
The AI route uses the Node runtime, a 60-second application timeout and
`maxDuration=65`. Confirm your Vercel project's plan/function settings allow this
runtime duration. Same-origin browser requests need no CORS proxy.

## 5. Vercel Production

After Preview acceptance, configure the **same two names scoped to Production**
with your production Groq key and tested model, then redeploy through your normal
workflow. Production uses the same single Next.js project, with no database or
Express service. Use environment-specific keys where practical, and review Groq
quota/spend settings. Secret values are provided by Vercel, never committed files.
See [Vercel environment scopes](https://vercel.com/docs/environment-variables).

This is a working restaurant/AI demo, not a restaurant order processing system.
Actual order persistence, payments and live tracking were not requested and are
not fabricated. Contact/order buttons preserve user-driven cart review.

## 6. Remaining acceptance

See [FLAVOUR_AI_VERIFICATION.md](./FLAVOUR_AI_VERIFICATION.md) for checks performed.
Live Groq model behavior/account permissions and deployed Vercel streaming must
be verified using your private key. Check current Next.js security advisories
again before production. Do not share secrets in chat or commit env files.
