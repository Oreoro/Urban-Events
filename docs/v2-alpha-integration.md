# Urban Events v2 Alpha Integration

## Scope

This branch merges Hi.Events `develop` at `f8b7261b` (`2.0.0-alpha.1`) into the
Urban Events stable-sync baseline while keeping the Urban Events product layer:

- Urban Events visual tokens, logos, typography, and runtime name fallbacks.
- Pakistan defaults (`PKR` and `Asia/Karachi`).
- Neem as the default local online payment provider.
- Existing Stripe and offline payment paths for installations that enable them.

The upstream v2 page and workflow architecture is retained. It is rendered
through the Urban Events design system rather than adopting upstream branding.

## Integrated v2 capabilities

- Recurring events and occurrence management.
- Occurrence cancellation/reactivation, capacity, price overrides, and product
  visibility.
- Reusable organizer locations and geocoding endpoints.
- Admin announcements and in-app announcement dismissal.
- Account-deletion request, cancellation, and administration flows.
- Organizer-level configuration, VAT, and Stripe Connect management.
- Occurrence-aware check-in, waitlist, messaging, statistics, and reports.
- Expanded promo-code product applicability.
- Updated embedded widget and checkout session behavior.

## Verification completed

- Frontend strict CSR and SSR production builds pass on React Router 8.
- Strict TypeScript compilation passes after the stabilization batch.
- Frontend production dependency audit reports zero known vulnerabilities.
- Composer production dependency audit reports zero known advisories after
  patching the affected document, HTTP, expression-parser, and spreadsheet
  packages.
- Azure Blob storage uses the maintained `azure-oss/storage-blob-laravel`
  provider. The obsolete Matthew Daly, League Azure, and Microsoft Azure SDK
  adapters have been removed, and package discovery resolves only the maintained
  provider.
- Locale extraction and compilation pass.
- Backend targeted integration tests pass: 48 tests / 68 assertions.
- The expanded v2 unit regression set passes: 187 tests / 258 assertions (19
  upstream tests are still marked risky because they contain no assertions).
- The complete backend unit suite passes under PHP 8.5 with `ext-intl`: 974
  tests / 2,266 assertions, with no failures or errors. Twenty-two upstream
  tests remain marked risky because they contain no PHPUnit assertions, and one
  test is skipped.
- API route audit confirms v2 occurrence, location, announcement, account
  deletion, public occurrence, Stripe, offline, and Neem routes.
- The production SSR auth shell was visually checked at 1280x720 and 390x844.
  The Urban Events logo, responsive single-column state, and
  no-horizontal-overflow behavior are intact, with no browser console errors.
- SSR hydration is stable: translated feature labels are resolved after locale
  activation instead of leaking Lingui message IDs into the server markup.
- The product quantity selector no longer imports the complete Lodash bundle;
  it uses direct `get` and `debounce` modules and cancels pending updates when
  unmounted.

Known upstream-alpha debt:

- ESLint still reports upstream-alpha localization, explicit-`any`, dependency,
  and assertion debt. Rules-of-Hooks violations have been eliminated.
- Twenty-two backend tests rely only on mock expectations and are reported as
  risky by PHPUnit because they do not contain PHPUnit assertions.
- The largest production JavaScript entry chunk remains above Vite's 500 kB
  advisory threshold and should be split after route-level profiling.

The lightweight `node scripts/verify-urban-v2.mjs` check and the frontend CI
workflow prevent future upstream syncs from silently dropping the Urban name,
PKR/Karachi defaults, Neem routes/provider UI, brand assets, occurrence schema,
or the maintained Azure storage driver.

These are stabilization items, not reasons to bypass the release gates below.

## Staging migration runbook

Do not run the v2 migrations against production first. The occurrence backfill
migration eventually drops legacy event date columns.

1. Snapshot the production database and uploaded storage.
2. Restore the snapshot into an isolated staging environment.
3. Install PHP with the extensions declared by Composer, including `ext-intl`,
   and Node 22.22 or newer.
4. Install locked dependencies and build the frontend from this exact commit.
5. Put staging workers and schedulers into maintenance before migrating.
6. Run `php artisan migrate --pretend` and archive the SQL output.
7. Run migrations on staging, then verify every existing event has at least one
   valid occurrence before accepting the legacy-date drop.
8. Rebuild caches and restart queue workers.
9. Smoke-test event creation, recurring occurrences, product creation, PKR
   checkout, Neem intent/confirmation/return, offline checkout, email delivery,
   attendee check-in, waitlist, announcements, and account deletion.
10. Compare order totals, attendee counts, event capacities, and upcoming-event
    counts with the pre-migration snapshot.

## Production release gate

Production release requires all of the following:

- A reviewed backup and restore drill.
- Clean staging migration and occurrence-count reconciliation.
- Neem sandbox transaction and payment-return confirmation.
- An Azure Blob read/write/upload smoke test with the production-equivalent
  connection configuration.
- A rollback window with the old application image and database snapshot retained.

If a post-migration rollback is needed, restore both the application and the
pre-v2 database snapshot together. Do not run the old application against the
v2 schema after the destructive occurrence migration.
