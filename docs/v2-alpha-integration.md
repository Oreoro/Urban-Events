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

- Frontend CSR and SSR production builds pass.
- Locale extraction and compilation pass.
- Backend targeted integration tests pass: 48 tests / 68 assertions.
- Backend unit suite executes: 926 tests pass / 2,183 assertions.
- API route audit confirms v2 occurrence, location, announcement, account
  deletion, public occurrence, Stripe, offline, and Neem routes.
- Auth shell was visually checked at 1280x720 and 390x844. The Urban Events logo,
  responsive single-column state, and no-horizontal-overflow behavior are intact.

Known upstream-alpha debt:

- Strict TypeScript and ESLint checks are not clean on the upstream v2 alpha.
- The full backend suite has failures when local PHP lacks `ext-intl`; three
  offline-email rendering expectations also fail unchanged on upstream v2.
- Composer audit reports advisories in upstream-locked document and HTTP packages.
- Production bundles warn about two chunks above 500 kB.

These are stabilization items, not reasons to bypass the release gates below.

## Staging migration runbook

Do not run the v2 migrations against production first. The occurrence backfill
migration eventually drops legacy event date columns.

1. Snapshot the production database and uploaded storage.
2. Restore the snapshot into an isolated staging environment.
3. Install PHP with the extensions declared by Composer, including `ext-intl`.
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
- A deliberate decision on the Composer security advisories.
- A rollback window with the old application image and database snapshot retained.

If a post-migration rollback is needed, restore both the application and the
pre-v2 database snapshot together. Do not run the old application against the
v2 schema after the destructive occurrence migration.
