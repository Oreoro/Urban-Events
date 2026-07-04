# Urban Events Upstream Sync Roadmap

## Goal

Urban Events is a branded fork of Hi.Events with Pakistan-focused defaults, UrbanEvents.pk visual identity, and the Neem/local payment integration.

The target is to bring Urban Events up to date with worthwhile Hi.Events upstream work while preserving:

- Neem payment provider support.
- Existing local/offline payment behavior.
- Pakistan/PKR/timezone defaults.
- Urban Events branding and color system.
- Any deployment or environment assumptions specific to Urban Events.

UI/UX polish should happen after the upstream feature and bug sync is stable, except for small design-system token work that makes later UI polish easier.

## Current Branch Scan

Hi.Events remote branch scan:

- Total remote branches fetched: 221
- Already merged into `hievents/main`: 50
- Not merged into `hievents/main`: 171
- Not merged into `origin/development`: 173

Current stable upstream target:

- `hievents/main`
- Latest fetched tag on main: `v.1.10.0-beta`
- Last inspected main commit: `619cbf0a` from 2026-07-01

Latest alpha/release-candidate line:

- `hievents/v2.0.0-alpha.1`
- `hievents/fix/v2.0.0-release-fixes`
- Last inspected alpha fix commit: `32f3ed4e` from 2026-07-03

The v2 alpha line is valuable but high risk. It includes framework/runtime upgrades and broad rewrites: Laravel 13, PHP 8.5 work, React/Mantine updates, embedded widget rewrite, recurring/occurrence changes, dashboard redesign, and release fixes. Do not fold this into the first stable sync.

## Protected Urban Events Surface

Treat these as protected during every merge and cherry-pick:

- `backend/app/DomainObjects/Enums/PaymentProviders.php`
- `backend/routes/api.php`
- `backend/app/Http/Actions/Orders/Payment/Neem/*`
- `backend/app/Services/Application/Handlers/Order/Payment/Neem/*`
- `frontend/src/api/order.client.ts`
- `frontend/src/queries/useCreateNeemPaymentIntent.ts`
- `frontend/src/queries/useConfirmNeemPayment.ts`
- `frontend/src/components/routes/product-widget/Payment/PaymentMethods/Neem/index.tsx`
- Checkout/payment return pages that branch on payment provider.
- Order status, refunds, payment provider, invoice, currency, and application fee code.

Neem is not a cosmetic fork change. It is a first-class payment integration and must survive upstream checkout/payment refactors.

## Phase 0: Baseline And Guardrails

Purpose: make the fork measurable before the merge.

Tasks:

1. Commit current bootstrap, merge audit, and first design-token work on a review branch.
2. Document current failing checks:
   - `yarn build:csr` passes.
   - `yarn build-strict:csr` currently fails on existing TypeScript debt.
3. Add or identify smoke tests/checklists for:
   - Event creation.
   - Product/ticket creation.
   - Checkout with Neem.
   - Checkout with offline payment.
   - Checkout with Stripe where configured.
   - Payment return handling.
   - Order completion and confirmation email.
   - Attendee check-in.
4. Inventory Urban-specific changes against `hievents/main`, especially payments, PKR defaults, branding, and environment config.

Exit criteria:

- Known baseline status is documented.
- Neem files and flows are explicitly tracked.
- There is a rollback point before upstream sync.

## Phase 1: Stable Hi.Events Main Sync

Purpose: get Urban Events current with stable upstream Hi.Events before chasing open branches.

Target:

- Merge `hievents/main` into Urban Events `origin/development` on a dedicated branch.

Recommended branch:

```bash
git switch -c codex/sync-hievents-main origin/development
git merge --no-commit --no-ff hievents/main
```

Known dry-run risk:

- Direct merge reports 58 content conflicts.
- Conflict areas include backend dependencies, Docker runtime config, app shell, layout files, checkout/payment pages, global styles, locale bundles, and shared utility/types files.

Resolution policy:

- Prefer upstream for generic Hi.Events bug fixes and framework-compatible shared code.
- Preserve Urban Events for Neem, PKR/Pakistan defaults, UrbanEvents branding, and deployment-specific config.
- For generated locale files, avoid hand-merging large generated output. Resolve source `.po` content intentionally, then regenerate compiled locale files.
- For `composer.lock` and `yarn.lock`, resolve package manifests first, reinstall/update lockfiles with the project package managers, then review lockfile churn.
- Do not remove Neem while accepting upstream checkout/payment refactors.

Exit criteria:

- The merged branch installs cleanly.
- Backend dependencies resolve.
- Frontend builds.
- Neem checkout still appears as a payment option when enabled.
- Local/offline payment still works.
- No accidental Hi.Events branding regression in visible Urban Events surfaces.

## Phase 2: High-Priority Bug And Security Sweep

Purpose: pull worthwhile branches that are not yet in `hievents/main`, without dragging in unrelated alpha churn.

Evaluate these first as cherry-picks or manual ports, not raw branch merges:

- `fix/security-xss-ssrf-session-verification`
- `fix/sanitize-email-template-body`
- `fix/ssrf-and-idor-security-vulnerabilitie`
- `fix-public-checkin-hide-email`
- `fix/query-params-int-cast`
- `fix/nullable-enum-basedto`
- `fix/tiered-product-negative-quantity-validation`
- `fix/waitlist-race-conditions`
- `feature/improve-overselling-safety`
- `fix/skip-connect-payout-events`
- `fix/deletion-status-stale-data`
- `fix/email-settings-toggle-not-persisting`
- `fix/widget-color-case-insensitive`
- `fix/null-order-item-price`
- `fix/include-offline-payment-attendees-in-export`
- `fix/server-error-checking-in-offline-attendees`

Rules:

- Prefer small commits over whole branches.
- If a fix branch is based on v2 alpha, extract only the actual fix into the stable sync branch.
- Add focused regression tests where the original fix clearly maps to checkout, capacity, security, or payment behavior.
- Review every payment-related fix against Neem, not only Stripe.

Exit criteria:

- Security and data-integrity fixes are either merged, rejected with a reason, or deferred to v2.
- Payment/capacity fixes have tests or smoke coverage.

## Phase 3: Product Feature Review

Purpose: decide what non-security features are worth integrating before UI polish.

High-value candidates:

- `feature/add-ticket-lookup`
- `feature/add-attendee-self-service-edit`
- `feature/custom-event-emails`
- `feature/add-scheduled-messages`
- `feature/messaging-tiers`
- `feature/new-admin-features`
- `admin-attendee-search-order-details`
- `feature/order-table`
- `feature/checkout-ui-improvements`
- `feature/theme-refactor`
- `feature/dashboard-redesign`
- `feature/image-metadata-improvements`
- `feature/waitlist-improvements`
- `feature/sold-out-waitlist`
- `feat/tracking-pixels`
- `feature/support-external-barcode-scanners`
- `feature/organizer-management-improvements`
- `feat/invoice-improvements`

Payment-sensitive candidates:

- `feat/organizer-level-payments`
- `feature/multi-currency-application-fees`
- `feature/platform-fee-improvements-updates`
- `feature/store-stripe-platoform-fees`
- `feature/store-vat-rate`
- `feature/stripe-migration`
- `feature/stripe-event-handling-improvements`

These should be reviewed only after the Neem abstraction is stable. Any upstream movement from account-level payments to organizer-level payments must be adapted so Neem is still configurable and testable.

Likely low-priority or skip:

- Old deployment branches for Vapor, Fly.io, DigitalOcean, and Docker unless they fix local setup.
- Revert branches unless they explain a regression relevant to Urban Events.
- Language-only branches unless localization is a current product priority.
- Stale 2024 experiment branches already covered by main.
- Framework upgrade branches until the v2 spike.

Exit criteria:

- A product-owner-approved shortlist exists.
- Each selected feature has a merge strategy and test path.
- Payment-sensitive changes have a Neem compatibility note before implementation.

## Phase 4: v2 Alpha Spike

Purpose: evaluate whether Urban Events should jump to the v2 alpha line or selectively port from it.

Target branches:

- `hievents/v2.0.0-alpha.1`
- `hievents/fix/v2.0.0-release-fixes`

Why it matters:

- Includes latest framework/runtime direction.
- Includes embedded widget rewrite.
- Includes React/Mantine update work.
- Includes recurring/occurrence improvements.
- Includes dashboard redesign and broader UI structure changes.

Why it is risky:

- Alpha line, not the stable mainline.
- Large change surface: the inspected v2 diff touches over 1,700 files.
- Framework upgrades can invalidate local environment assumptions.
- Checkout/widget changes can break Neem if merged blindly.

Spike process:

1. Create a disposable branch from the Phase 1/2 synced branch.
2. Attempt merge or replay of `fix/v2.0.0-release-fixes`.
3. Record conflicts and runtime failures.
4. Specifically test payment provider selection, Neem payment intent creation, confirmation, and return handling.
5. Decide one of:
   - Adopt v2 branch wholesale with dedicated stabilization.
   - Selectively port v2 features.
   - Defer v2 until upstream stabilizes beyond alpha.

Exit criteria:

- Clear accept/defer decision for v2.
- If accepted, a dedicated v2 stabilization milestone is created.

## Phase 5: UI/UX Polish After Sync

Purpose: make the app feel like Urban Events, not a partially rebranded fork.

Do this after the stable upstream sync and critical bug sweep, because upstream merges will touch many of the same screens.

Design-system work:

- Finalize Mantine theme tokens for UrbanEvents.pk colors.
- Define component defaults for Button, ActionIcon, Card/Paper, Modal, Table, TextInput, Select, Badge, Alert, Tabs, NavLink, and Notifications.
- Normalize radius, shadows, typography, spacing, focus states, and disabled/loading states.
- Replace scattered hardcoded colors with semantic tokens.
- Keep admin UI dense, calm, and operational.
- Keep public event/checkout UI more polished, branded, and conversion-focused.

Screen priorities:

1. Auth and onboarding.
2. Organizer/event dashboard.
3. Event creation and event settings.
4. Product/ticket management.
5. Checkout and payment selection, including Neem.
6. Order summary and payment return states.
7. Public event page and organizer page.
8. Tables: attendees, orders, products, promo codes, check-in lists.

Verification:

- Use Playwright screenshots for desktop and mobile.
- Check public event page, checkout, payment return, organizer dashboard, and event management.
- Verify no text overlap, broken responsive states, inaccessible contrast, or missing loading/empty/error states.

## Phase 6: Release And Push Strategy

Recommended PR sequence:

1. Bootstrap and design-token baseline.
2. Stable `hievents/main` sync with Neem preserved.
3. Security and bug-fix sweep.
4. Product feature batch 1.
5. Product feature batch 2 if needed.
6. UI/UX polish pass.
7. Optional v2 alpha adoption branch.

Do not push directly to a protected/default branch. Push review branches back to `Muxoai/Urban-Events` and merge through PR unless explicitly approved otherwise.

Each PR should include:

- What upstream branch/commits were integrated.
- What Urban-specific behavior was preserved.
- Payment/Neem verification notes.
- Build/lint/test output.
- Rollback notes.

## Immediate Next Step

Start Phase 0/1:

1. Commit the current bootstrap and theme-token baseline.
2. Create `codex/sync-hievents-main`.
3. Run the real `hievents/main` merge with `--no-commit`.
4. Resolve conflicts in the order:
   - dependency manifests and lockfiles,
   - backend payment/order domain,
   - routes/API resources,
   - checkout/payment frontend,
   - app shell/layout/global styles,
   - locales last.
5. Re-run install/build checks and Neem checkout smoke testing.
