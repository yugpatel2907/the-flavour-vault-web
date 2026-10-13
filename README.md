# The Flavour Vault — Ambrocia's

The restaurant demo and Flavour AI run in **one Next.js application**. Deploy the
repository root to Vercel. No separately hosted backend or database is required.
The Groq key stays in the Next.js server route, never in browser code.

## Local development

Use Node.js 22.18+ (Node 22.x or 24.x LTS recommended).

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Menu, carousels, cart, reservation demo and checkout
demo work without environment variables. To enable live AI, create root
`.env.local` privately using [.env.example](./.env.example), and fill your Groq
key. See [FLAVOUR_AI_SETUP.md](./FLAVOUR_AI_SETUP.md) for exact instructions.
Do not overwrite an existing private env file or commit it.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

`npm start` serves the production build locally. `./run-local.sh` starts the single
development server in the foreground; Ctrl+C stops it.

## Runtime and deployment

- `src/data/menu.ts` combines the existing menu and Punjabi carousel records.
  The menu UI, `/api/menu`, Flavour AI cards and cart use these same real records.
- `/api/ai/chat` is a streaming Next.js Node route using AI SDK and Groq. Its
  seven validated tools prepare cart actions for the existing CartContext.
- Checkout, reservations and tracking are **clearly labelled demos**. No orders,
  payments or reservations are sent or stored. Call the listed restaurant number
  to make a real booking/order. AI only prepares a summary and opens cart review.
- Vercel: Next.js preset, root directory `.`, `npm ci`, `npm run build`, Node 22.x.
  Configure private `GROQ_API_KEY` and non-public `AI_MODEL` separately in Preview
  and Production. Redeploy after changes. No `BACKEND_URL`, database, admin token,
  separate Express deployment or CORS configuration is needed.

The obsolete Express backend, tracked dependency files, unused 3D code and
duplicate setup files have been removed. The active UI animations, menu image,
cart, Flavour AI and root regression tests are retained.

See [FLAVOUR_AI_VERIFICATION.md](./FLAVOUR_AI_VERIFICATION.md) for actual checks,
limits and remaining live-provider/deployment acceptance.
