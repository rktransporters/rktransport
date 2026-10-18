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

Open `http://localhost:3000`. The frontend uses the same-origin `/api/v1` proxy for browser API calls so the backend's httpOnly authentication cookie is not exposed to JavaScript. Server-rendered content fetches use the private `API_BASE_URL`.

## Checks

```powershell
npm run lint
npm run type-check
npm run build
```

## Deploy to Cloudflare

This app uses Next.js server rendering, API routes, authentication middleware, and on-demand revalidation. Deploy it as a **Cloudflare Worker** with the OpenNext adapter; a static Cloudflare Pages upload/export does not support these features.

1. In Cloudflare, create the R2 bucket `rk-transport-frontend-opennext-cache` and enable Cloudflare Images transformations on the zone used by the site. The Worker configuration uses R2 for Next.js incremental caching and Durable Objects for revalidation.
2. From `client/`, install dependencies and authenticate Wrangler:

   ```powershell
   npm install
   npx wrangler login
   ```

3. Configure the Worker secrets. `API_BASE_URL` is the deployed FastAPI origin without `/api/v1`; the other two secrets must match the backend:

   ```powershell
   npx wrangler secret put API_BASE_URL
   npx wrangler secret put SECRET_KEY
   npx wrangler secret put REVALIDATE_SECRET
   ```

   Set `API_BASE_URL` as a **build-time** variable too, using the same backend origin, so content can be fetched while Next.js prerenders pages. Set `NEXT_PUBLIC_SITE_URL` to the public Cloudflare site URL as a build-time variable so generated canonical URLs use the production domain. Add any optional analytics or verification build variables there as well. For local CLI builds, put the build-time values in `.env.local`; for Workers Builds, configure them in the build environment. `COOKIE_NAME` is already set to `access_token` in `wrangler.jsonc`.

4. Build and preview in the Cloudflare Workers runtime, then deploy:

   ```powershell
   npm run cf:preview
   npm run cf:deploy
   ```

   The first deploy applies the Durable Object migrations from `wrangler.jsonc`. In Cloudflare Workers Builds, set the project root to `client/`, the build command to `npm run cf:build`, and the deploy command to `npx opennextjs-cloudflare deploy`.

5. Update the backend's `ALLOWED_ORIGINS` and `FRONTEND_URL` to the Cloudflare site URL. Keep its `REVALIDATE_SECRET` equal to the frontend Worker secret. Cloudflare's Worker variables and secrets are separate from local `.env.local`; use `.dev.vars` for local Worker preview values (copy `.dev.vars.example` and replace the placeholders).

Cloudflare's Next.js image optimization uses the Cloudflare Images binding and may incur separate image-transformation charges. Image content can continue to use Cloudinary URLs.

The backend remains a separate FastAPI deployment. Do not configure Cloudflare Pages to publish `.next` or `.open-next` as a static directory.

## Vercel deployment

For an existing Vercel setup, deploy `client/` as the Vercel Next.js project. Set `API_BASE_URL` to the deployed FastAPI origin, set `SECRET_KEY` and `COOKIE_NAME` to match the backend, and set `REVALIDATE_SECRET` to the same value configured by the backend. Do not add a `/api/v1` suffix to `API_BASE_URL`.

Image URLs stored in site content should point to Cloudinary. For additional image hosts, add a narrowly scoped host to `next.config.mjs`.

The admin dashboard manages homepage hero slides and section backgrounds, and uploads the Cars and Routes & Coverage page hero images on fleet vehicle and location records.

See [server/README.md](../server/README.md) for backend deployment, database migrations, cookie and CORS settings, and the launch checklist.
