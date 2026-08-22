# Cloudflare deployment

Urban Events can run on Cloudflare Workers + Containers without changing the React/Mantine design system or Laravel APIs. The Worker routes every request to one Laravel/React all-in-one container and wakes it hourly so Laravel's scheduler can run. Redis runs inside that single container on localhost, so Laravel cache and queues use Redis with no external Redis service.

## Cost guardrails

- Workers Paid base plan: USD 5/month.
- Container size: `basic` (1 GiB memory, 1/4 vCPU, 4 GB ephemeral disk).
- Maximum live instances: 1.
- Idle sleep: 5 minutes.
- Runtime budget: 400 container-hours per UTC month.
- Hourly scheduler wakeup: minute 7 of each hour.
- Log sampling: 10%; trace sampling: 1%.

The runtime budget deliberately leaves room below the USD 20 operating ceiling for Workers, Durable Objects, logs, and modest egress. Cloudflare billing does not provide a hard account spend cap, so dashboard billing alerts should also be set at USD 10, 15, and 18.

## Embedded Redis

The container image includes `redis-server`, managed by Supervisor on `127.0.0.1:6379` before Nginx, PHP-FPM, and the queue worker start. It runs loopback-only with persistence disabled (the container disk is ephemeral) and a 256 MB memory cap using `volatile-lru`: expiring cache keys can evict under pressure while queue data is protected. Laravel uses:

- `CACHE_DRIVER=redis` / `CACHE_STORE=redis`
- `QUEUE_CONNECTION=redis`
- `SESSION_DRIVER=cookie`

Because only one container instance exists (`max_instances: 1`), localhost Redis cannot split-brain across instances. Container restarts drop in-flight queued jobs; this matches the existing ephemeral-disk tradeoff and keeps webhooks recoverable through their normal retry paths.

## External services

Containers have ephemeral disks. Production therefore requires:

1. An external PostgreSQL `DATABASE_URL`. A scale-to-zero Neon database is suitable for low traffic.
2. Two R2 buckets (public and private) exposed through the S3-compatible API.
3. An R2 API token with object read/write access for those buckets.
4. One Urban Events Stripe account for all paid tickets. Organizers do not connect their own Stripe accounts. If Stripe credentials are not yet available, the container starts with paid checkout disabled instead of accepting an incomplete payment configuration.

The deployment workflow reuses the existing `AZURE_APP_SECRETS` repository secret for Laravel and mail settings. Cloudflare-specific replacements, including the Neon `DATABASE_URL`, belong in `CLOUDFLARE_APP_OVERRIDES` and are merged after the legacy settings. Stripe credentials belong in the separate `STRIPE_APP_SECRETS` secret. The workflow replaces storage values with the new R2 credentials and writes the merged object to a mode-`0600` secrets file on the ephemeral runner. Wrangler consumes that file with `--secrets-file` during deployment; the JSON never enters GitHub's cross-step environment or command output.

Stripe is enabled only when the publishable key, secret key, and webhook signing secret are all present. Partial Stripe credentials fail the deployment. The Cloudflare deployment always disables Neem; legacy Neem credentials may remain stored during the transition, but they are not exposed as a checkout provider. When Stripe is complete, the workflow enables platform-managed payments and disables Stripe Connect/organizer setup.

The generated Worker secret has this shape:

```json
{
  "APP_KEY": "base64:...",
  "JWT_SECRET": "...",
  "DATABASE_URL": "postgresql://...",
  "STRIPE_PUBLIC_KEY": "pk_test_...",
  "STRIPE_SECRET_KEY": "sk_test_...",
  "STRIPE_WEBHOOK_SECRET": "whsec_...",
  "STRIPE_ENABLED": "true",
  "STRIPE_PLATFORM_MANAGED": "true",
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
   - Existing secret `AZURE_APP_SECRETS` remains the source for legacy application and mail settings
   - Secret `CLOUDFLARE_APP_OVERRIDES` contains newline-delimited Cloudflare replacements, including the Neon `DATABASE_URL`
   - Secret `STRIPE_APP_SECRETS` contains exactly the three newline-delimited Stripe variables shown below. Start with test-mode credentials.

     ```dotenv
     STRIPE_PUBLIC_KEY=pk_test_...
     STRIPE_SECRET_KEY=sk_test_...
     STRIPE_WEBHOOK_SECRET=whsec_...
     ```

4. In Stripe Workbench, create a test-mode webhook destination for `https://app.urbanevents.pk/api/public/webhooks/stripe`. Subscribe to `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.succeeded`, `charge.updated`, `charge.refunded`, `refund.created`, and `refund.updated`. Put that endpoint's `whsec_...` value in `STRIPE_APP_SECRETS`.
5. Run the **Cloudflare Container** workflow manually with **deploy** enabled. The workflow validates the Worker, builds one AMD64 image, pushes that commit-tagged image to Cloudflare's managed registry, deploys the Worker with Cloudflare's official Wrangler action, uploads the runtime secret, and smoke-tests `/healthz` plus `/auth/login` using the action's deployment URL.
6. Wait for `npx wrangler containers list` to report a ready deployment.
7. In Stripe test mode, test event creation, a successful card payment, a declined card, webhook completion, a refund, uploads, and QR check-in.
8. Only after the full test-mode flow passes, create the equivalent live-mode webhook destination and replace all three values together with the matching live-mode credentials. Never combine test keys with a live webhook secret.

Because these are direct charges on one Urban Events Stripe account, Urban Events is responsible for customer statements, refunds, disputes, tax/compliance obligations, and settling ticket proceeds with organizers outside Stripe Connect.

Pushes and pull requests run the same Worker validation and production Docker build without deploying. This keeps image construction in GitHub Actions while leaving production release as an explicit, protected action.

## Rollback

Keep the current Azure DNS/origin unchanged until the Cloudflare deployment passes the smoke suite. If a later cutover fails, remove the Worker route to restore the Azure origin; the database and R2 data remain external and are not deleted.
