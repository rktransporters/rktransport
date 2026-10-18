# RK Transport frontend

Next.js App Router frontend for the RK Transport UAE vehicle transport, lift/recovery, and storage business.

## Local development

1. Copy `.env.example` to `.env.local`. Set `API_BASE_URL` to the FastAPI backend root (for local work, `http://localhost:8000`), and set `SECRET_KEY` to the same value as the backend JWT signing secret. Keep `COOKIE_NAME` in sync with the backend.
2. Install dependencies and start the frontend:

   ```powershell
   npm install
   npm run dev
   ```

3. Start the backend separately using the instructions in `../server/README.md`.

For a full local Pages preview, first build the static site with the backend reachable at `API_BASE_URL`, then run the Pages emulator:

   ```powershell
   npm run pages:build
   npm run pages:preview
   ```

The preview uses the Pages Functions under `functions/` for same-origin API requests and admin authentication. Copy `.dev.vars.example` to `.dev.vars` and set the local backend URL and matching JWT secret for those Functions. `npm run dev` is also available for rapid Next.js UI work, but it does not run the Pages Functions.

## Checks

```powershell
npm run lint
npm run type-check
npm run build
```

## Deploy to Cloudflare

This frontend is exported as a static site and deployed to **Cloudflare Pages**. Pages Functions provide the same-origin backend API proxy, admin dashboard access check, and a deploy-hook endpoint for rebuilding the static site after content changes. The backend and its database remain separate; **R2 and a Worker deployment are not required**.

### Cloudflare Pages project settings

Connect the GitHub repository to a Cloudflare Pages project and configure:

- **Root directory:** `client`
- **Build command:** `npm run pages:build`
- **Build output directory:** `out`
- **Framework preset:** `None` (do not select the Next.js Worker/OpenNext preset)
- **Node.js version:** `22`

Set these environment variables in the Pages project:

| Variable | Used by | Value |
| --- | --- | --- |
| `API_BASE_URL` | Build and Functions | Deployed FastAPI origin, without `/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | Build | Public Pages site URL, such as `https://www.example.com` |
| `SECRET_KEY` | Functions | Same JWT signing secret as the backend |
| `COOKIE_NAME` | Functions | Same backend cookie name; usually `access_token` |
| `REVALIDATE_SECRET` | Functions | Same value as the backend's `REVALIDATE_SECRET` |
| `PAGES_DEPLOY_HOOK_URL` | Functions | HTTPS deploy-hook URL created in Pages project settings |

Set `API_BASE_URL` in both the Pages build environment and the Functions runtime variables; it must be the same backend origin in both places. `NEXT_PUBLIC_SITE_URL` is a build variable. Set the remaining entries as Functions runtime variables/secrets, and mark the three secret values as secrets in Cloudflare.

Keep secrets (`SECRET_KEY`, `REVALIDATE_SECRET`, and `PAGES_DEPLOY_HOOK_URL`) out of source control. Set the backend's `FRONTEND_URL` to the Pages site URL and include that URL in the backend's `ALLOWED_ORIGINS`.

### Publish and refresh content

Push changes to the connected Git branch, or run `npm run pages:build` locally with a reachable backend and the build variables above. The build fetches public content from the backend and generates the service and vehicle detail pages from the records available at build time. Keep at least one service active; Next.js static export needs a generated path for the service detail route.

Admin edits continue to save directly to the backend. After a public content edit, the backend calls `/api/revalidate`; the Pages Function validates `REVALIDATE_SECRET` and triggers the configured Pages deploy hook. Cloudflare then rebuilds and publishes the static site. This is a **full site rebuild**, not instant on-demand page revalidation, so content changes appear when that deployment finishes. The deploy hook URL must be configured or the endpoint returns an error instead of claiming the content was refreshed.

The static export disables Next.js image optimization. Use public image URLs (for example, Cloudinary URLs) for uploaded content. Static-site pages do not read backend data at request time; interactive forms and admin screens use the same-origin `/api/v1` Pages Function to reach the backend.

The backend remains a separate FastAPI deployment. Do not publish `.next` as the Pages output directory; the correct output is `out`.

## Vercel deployment

For an existing Vercel setup, deploy `client/` as the Vercel Next.js project. Set `API_BASE_URL` to the deployed FastAPI origin, set `SECRET_KEY` and `COOKIE_NAME` to match the backend, and set `REVALIDATE_SECRET` to the same value configured by the backend. Do not add a `/api/v1` suffix to `API_BASE_URL`.

Image URLs stored in site content should point to Cloudinary. For additional image hosts, add a narrowly scoped host to `next.config.mjs`.

The admin dashboard manages homepage hero slides and section backgrounds, and uploads the Cars and Routes & Coverage page hero images on fleet vehicle and location records.

See [server/README.md](../server/README.md) for backend deployment, database migrations, cookie and CORS settings, and the launch checklist.
