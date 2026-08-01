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

## v2 UI policy

The v2 merge is a product and workflow upgrade, not a wholesale visual reset.
Upstream information architecture, recurring-event controls, payment settings,
reporting, and responsive behavior are retained, while the presentation layer
continues to use the existing Urban Events Mantine theme and semantic tokens.

In practical terms:

- Urban Events logos, typography, cream canvas, deep green/plum primary,
  coral, marigold, mint, and sky tokens remain authoritative.
- New v2 screens use the existing shared cards, inputs, tables, buttons,
  modals, spacing, and responsive breakpoints.
- Upstream Hi.Events branding and visual defaults are not allowed to replace
  the Urban Events shell, auth experience, public pages, or checkout.
- UI changes in the stabilization branch are limited to compatibility,
  accessibility, localization, and correctness fixes. A broader redesign must
  be reviewed separately after staging validates the v2 workflows.

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
- Locale-dependent option data now resolves at render time for recurrence
  schedules, report ranges, language names, social links, and Stripe capability
  and requirement labels. This avoids stale module-load translations during SSR
  and after locale activation.
- Filter/query synchronization now validates filter operators, parses pagination
  values as numbers, preserves unknown parameters under `additionalParams`, and
  cancels pending debounced navigation when the hook unmounts.
- Google, Meta, TikTok, and tag-manager adapters use typed browser globals and
  cleanup paths instead of broad `any` casts and ignored TypeScript errors.
- The product quantity selector no longer imports the complete Lodash bundle;
  it uses direct `get` and `debounce` modules and cancels pending updates when
  unmounted.
- Production client dependencies are separated into stable React, Router, and
  data-client chunks. The former 726.87 kB entry is now 302.51 kB; React 19's
  indivisible client runtime is 544.93 kB (170.52 kB gzip), Router is 96.25 kB,
  and the data clients are 89.67 kB. CI caps the entry at 350 kB and every
  production chunk at 550 kB, just above the React runtime rather than masking
  application growth.

Known upstream-alpha debt:

- ESLint debt was reduced from 1,074 findings (608 errors / 466 warnings) to
  727 findings (298 errors / 429 warnings). Every remaining error is a Lingui
  localization-rule finding; there are no remaining non-localization hard
  errors. The warning backlog is primarily explicit `any`, exhaustive-dependency,
  and non-null-assertion debt inherited from the alpha line. Rules-of-Hooks
  violations have been eliminated.
- Non-English catalogs currently have 751 untranslated source fallbacks (the
  partially translated Russian catalog has 2,879). Catalog extraction and
  compilation succeed, but translation completion remains a separate content
  workstream.
- Twenty-two backend tests rely only on mock expectations and are reported as
  risky by PHPUnit because they do not contain PHPUnit assertions.

The lightweight `node scripts/verify-urban-v2.mjs` and
`node scripts/verify-frontend-bundle.mjs` checks plus the frontend CI workflow
prevent future upstream syncs from silently dropping the Urban name,
PKR/Karachi defaults, Neem routes/provider UI, brand assets, occurrence schema,
maintained Azure storage driver, or production bundle boundaries.

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
