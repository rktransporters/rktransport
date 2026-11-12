# RK Transport API

FastAPI backend for the RK Transport website, bookings, content management, and admin.

## Local development

1. Use Python 3.11 or newer.
2. Copy `.env.example` to `.env` and configure `DATABASE_URL`, `SECRET_KEY`, and the admin credentials.
3. Install and run:

   ```powershell
   pip install -r requirements.txt
   alembic upgrade head
   python scripts\seed_database.py
   uvicorn main:app --reload
   ```

The API is available at `http://localhost:8000`; OpenAPI docs are at `/docs`. The public API prefix is `/api/v1`. Schema changes are applied with Alembic, and `scripts/seed_database.py` seeds defaults explicitly. The application does not run schema creation or seeding during startup.

Run the seed command from the `server/` directory after migrations. It creates the configured admin user and default site settings, locations and routes, services, vehicle types, fleet cars, hero slide, FAQs, and page copy (including the homepage section banner keys and booking steps). It is safe to run again; existing default records are not duplicated. Fleet vehicle and location records support page-banner image URLs; the admin image uploader stores uploads through the configured Cloudinary account.

The normal seed command deliberately does not overwrite an existing admin password. To explicitly reset a deployed admin account to the credentials in the current environment, run `python scripts/reset_admin_password.py`.

## Deploy

Deploy `server/` as a FastAPI service on your chosen backend host. Configure `DATABASE_URL` and the required secrets as environment variables. Run `alembic upgrade head` and `python scripts/seed_database.py` as a deployment task before routing traffic to the new build. For production, set `COOKIE_SECURE=true`, restrict `ALLOWED_ORIGINS` to the frontend origin, and configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` for image uploads. `FRONTEND_URL` and `REVALIDATE_SECRET` must refer to the deployed frontend and match its revalidation route.

The frontend proxies browser requests through its same-origin `/api/v1` route. Keep `API_BASE_URL` private in the frontend deployment environment; it is the backend origin, without `/api/v1`.

## Authentication and validation

Admin sessions use JWTs in httpOnly cookies. Passwords are hashed before persistence. Public booking and inquiry payloads are validated and rate limited. The settings and all editable content are persisted in PostgreSQL.

## Migrations

Alembic configuration and schema migrations are under `alembic/`. Review and apply migrations using the configured database before deploying schema changes.

Follow your backend host's documentation for configuring the Python runtime, environment variables, and deployment tasks. Keep the migration, seed, uploads, cookie/CORS, and frontend revalidation settings above in the deployment checklist.
