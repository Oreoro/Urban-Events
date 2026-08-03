# Cloudflare deployment

Urban Events can run on Cloudflare Workers + Containers without changing the React/Mantine design system or Laravel APIs. The Worker routes every request to one Laravel/React all-in-one container and wakes it hourly so Laravel's scheduler can run.

## Cost guardrails

- Workers Paid base plan: USD 5/month.
- Container size: `basic` (1 GiB memory, 1/4 vCPU, 4 GB ephemeral disk).
- Maximum live instances: 1.
- Idle sleep: 5 minutes.
- Runtime budget: 400 container-hours per UTC month.
- Hourly scheduler wakeup: minute 7 of each hour.
- Log sampling: 10%; trace sampling: 1%.

The runtime budget deliberately leaves room below the USD 20 operating ceiling for Workers, Durable Objects, logs, and modest egress. Cloudflare billing does not provide a hard account spend cap, so dashboard billing alerts should also be set at USD 10, 15, and 18.

## External services

Containers have ephemeral disks. Production therefore requires:

1. An external PostgreSQL `DATABASE_URL`. A scale-to-zero Neon database is suitable for low traffic.
2. Two R2 buckets (public and private) exposed through the S3-compatible API.
3. An R2 API token with object read/write access for those buckets.
4. Existing Neem credentials. Stripe remains disabled.

The deployment workflow reuses the existing `AZURE_APP_SECRETS` repository secret for Laravel, database, mail, and Neem settings. It replaces only the storage values with the new R2 credentials and uploads the merged object as the `APP_SECRETS_JSON` Worker secret without printing it.

The generated Worker secret has this shape:

```json
{
  "APP_KEY": "base64:...",
  "JWT_SECRET": "...",
  "DATABASE_URL": "postgresql://...",
  "NEEM_BASE_URL": "https://...",
  "NEEM_BASE_TOKEN": "...",
  "NEEM_PARTNER_ID": "...",
  "NEEM_DECRYPTION_KEY": "...",
  "AWS_ACCESS_KEY_ID": "...",
  "AWS_SECRET_ACCESS_KEY": "...",
  "AWS_DEFAULT_REGION": "auto",
  "AWS_PUBLIC_BUCKET": "urban-events-public",
  "AWS_PRIVATE_BUCKET": "urban-events-private",
  "AWS_ENDPOINT": "https://ACCOUNT_ID.r2.cloudflarestorage.com",
  "AWS_USE_PATH_STYLE_ENDPOINT": "true",
  "AWS_URL": "https://pub-1e08d4a4810a4ff1bbffe100276567de.r2.dev"
}
```

Optional mail, Maps, Sentry, and branding variables can be added to the same JSON object. All values must be strings.

## Local checks

```sh
cd cloudflare
npm ci
npm run check
```

Copy `.dev.vars.example` to `.dev.vars` only when running `wrangler dev`. Never commit `.dev.vars`.

## First deployment

1. Activate Workers Paid on the Cloudflare account.
2. Create the PostgreSQL database and R2 buckets.
3. Add the following GitHub Actions repository secrets:
   - Secret `CLOUDFLARE_API_TOKEN` with Workers Scripts and Containers edit access
   - Secret `R2_ACCESS_KEY_ID` scoped to object read/write for `urban-events-public` and `urban-events-private`
   - Secret `R2_SECRET_ACCESS_KEY` from the same scoped R2 token
   - Existing secret `AZURE_APP_SECRETS` remains the source for the application, PostgreSQL, and Neem settings
4. Run the **Cloudflare Container** workflow manually with **deploy** enabled. The workflow validates the Worker, builds one AMD64 image, pushes that commit-tagged image to Cloudflare's managed registry, deploys the Worker with Cloudflare's official Wrangler action, uploads the runtime secret, and smoke-tests `/healthz` plus `/auth/login` using the action's deployment URL.
5. Wait for `npx wrangler containers list` to report a ready deployment.
6. Test event creation, uploads, Neem checkout, and QR check-in on the `workers.dev` URL.
7. Only after those checks pass, add `app.urbanevents.pk/*` as a Worker route and remove the old Azure origin mapping.

Pushes and pull requests run the same Worker validation and production Docker build without deploying. This keeps image construction in GitHub Actions while leaving production release as an explicit, protected action.

## Rollback

Keep the current Azure DNS/origin unchanged until the Cloudflare deployment passes the smoke suite. If a later cutover fails, remove the Worker route to restore the Azure origin; the database and R2 data remain external and are not deleted.
