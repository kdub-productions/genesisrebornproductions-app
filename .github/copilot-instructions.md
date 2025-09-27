## Quick orientation for AI coding agents

This Next.js (app router) site is a small music/beat storefront with social integrations. The notes below focus only on discoverable, actionable patterns and files you should inspect before changing behavior.

### Big picture
- Next.js app-router structure under `src/app/` (server components by default). Global layout is `src/app/layout.tsx`.
- UI components live in `src/components/`. Many components are client components (`"use client"`) — check the file header.
- API routes are under `src/app/api/*` (e.g. `discord.ts`, `email`, `stripe/*`). Treat these as server-side handlers (node environment).
- Public assets (audio previews, images) live in `public/` and are referenced directly in code (see `src/types/beats.ts` example data).

### Key files to read when making changes
- `package.json` — scripts: `dev` (`next dev --turbo`), `build` (`next build`), `start` (`next start`), `lint` (`next lint`).
- `next.config.js` — image remotePatterns (YouTube thumbnails), `experimental.turbo` is enabled.
- `src/app/layout.tsx` — analytics and global imports (fonts, global CSS).
- `src/app/api/discord.ts` — canonical example of a server-side integration using `discord.js`.
- `src/utils/socialMediaApi.ts` — shows how Twitter (X), Discord, and Instagram are fetched/handled. Instagram uses manual data.
- `src/utils/instagramSocialMediaData.ts` — manually-updated Instagram posts (edit content here; no API keys needed).
- `src/components/BeatPurchaseForm.tsx` — example client component that posts to `/api/email` and uses localStorage for customer info.
- `src/types/beats.ts` — data shapes for beats/licenses used across the app.

### Environment variables and external integrations
The app expects several env vars for integrations. Concrete names discovered in code:
- Discord: `DISCORD_BOT_TOKEN`, `DISCORD_CHANNEL_ID`, `DISCORD_SERVER_ID` (see `src/app/api/discord.ts` and `src/utils/socialMediaApi.ts`).
- Twitter (X): `TWITTER_BEARER_TOKEN`, `TWITTER_USERNAME` (see `src/utils/socialMediaApi.ts`).
- Stripe and email (nodemailer) keys are used in `src/app/api/stripe/*` and `src/app/api/email` (search the `api/stripe` and `api/email` folders).

Notes: env var changes require restarting the dev server. Keep tokens out of source; README suggests copying `.env.local.example` to `.env.local` (if present).

### Conventions & patterns to follow
- Path alias `@/*` is configured in `tsconfig.json`; prefer `@/` imports for internal modules.
- Server vs client components: files that include `"use client"` are interactive and can use hooks/state. Server components must not use client-only APIs (window, localStorage, hooks).
- Social integrations: Instagram uses static data (`instagramSocialMediaData.ts`). Twitter and Discord call real APIs server-side and gracefully return empty arrays if credentials are missing.
- Static assets: audio and images referenced in `src/types/beats.ts` and pages should point to `public/` paths (e.g., `/audio/previews/GhostTownsample.mp3`). Keep these paths consistent.
- CSS: organized under `src/styles/*` by page and component. Keep classNames consistent with existing CSS files.

### Common pitfalls & troubleshooting hints
- Discord 403/401: `discord` handlers include helpful console guidance — verify bot permissions, Message Content Intent, and regenerate token if needed (`src/app/api/discord.ts`, `src/utils/socialMediaApi.ts`).
- Missing env vars → empty arrays returned from social fetchers. Tests that rely on API data may fail without credentials.
- Changing `next.config.js` or `tsconfig.json` may require a server restart and sometimes a clean build (`npm run build`).

### How to run locally (Windows PowerShell)
Use the scripts in `package.json`. From repo root:

```powershell
npm install
npm run dev   # start dev server at http://localhost:3000
npm run build # production build
npm run start # run production build
npm run lint  # run Next.js/ESLint checks
```

### Where to add tests or small changes
- There is no test harness in the repo; add targeted unit tests near the code you change and update `package.json` scripts if you add a test runner.

### If you modify social or payment code
- For Discord/Twitter: update env vars, restart server, and use the server-side API endpoints under `src/app/api/*` to verify returned shapes.
- For Stripe/email: follow existing patterns in `src/components/BeatPurchaseForm.tsx` and API handlers under `src/app/api/stripe` and `src/app/api/email`.

---
If any section above is unclear or you'd like examples added (short code snippets or a checklist for spinning up credentials locally), tell me which area to expand and I will iterate.
