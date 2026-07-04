# Urban-Events / Hi.Events Merge Audit

## Base Decision

- Base repository: `Muxoai/Urban-Events`
- Base branch: `origin/development`
- Working branch: `codex/hievents-merge`
- Upstream/reference repository: `HiEventsDev/Hi.Events`
- Upstream branch inspected: `hievents/main`
- Mantine upgrade branch inspected: `hievents/update-mantine-ui`

## Current Stack

- Backend: Laravel 12, PHP 8.2+ target, Composer
- Frontend: React 18, Vite 5, TypeScript, Mantine 8, Yarn 1
- Current Urban-Events frontend already uses Mantine 8 dependencies, so the first UI pass should focus on design-system tokens and selective upstream UI ports rather than another Mantine version migration.

## History Shape

`origin/development` and `hievents/main` share a common ancestor, but neither branch contains the other.

Current divergence:

- Urban-Events-only commits: 141
- Hi.Events-main-only commits: 270

The Hi.Events `update-mantine-ui` branch is a single upstream commit for Mantine 7 to 8, but the current Urban-Events package metadata already has Mantine 8 packages.

## Direct Merge Risk

A dry `git merge-tree` of `origin/development` and `hievents/main` reports 58 content conflicts. High-risk conflict areas include:

- Backend dependencies: `backend/composer.json`, `backend/composer.lock`
- Docker/all-in-one runtime config
- App shell and routing: `frontend/src/App.tsx`, `frontend/index.html`
- Shared UI/layouts: app sidebar/topbar, auth layout, organizer homepage, event cards
- Checkout/payment flows: product widget payment and return pages
- Locales: generated `.js` bundles and `.po` files across all supported languages
- Shared frontend utilities: `config.ts`, `currency.ts`, `types.ts`, global styles

This should not be merged as one large conflict-resolution commit unless the goal is a full upstream sync with dedicated regression time.

## Recommended Merge Path

1. Keep Urban-Events as the product base and preserve Pakistan-specific changes such as PKR defaults and Neem/payment work.
2. Port upstream improvements in narrow groups:
   - Security/data integrity fixes first.
   - Dependency updates with lockfile verification.
   - Checkout and ticketing fixes.
   - Admin/operator UI enhancements.
   - Public event and organizer page design refinements.
3. Keep locale updates separate from behavior changes.
4. Use visual verification for public event, checkout, auth, organizer dashboard, and event management screens before PR.

## First UI Pass

The first implemented UI pass establishes UrbanEvents brand tokens at the Mantine and global CSS layer:

- Deep green/plum primary: `#20342F`
- Cream canvas: `#F7F7F2`
- Coral accent: `#C86D4C`
- Marigold highlight: `#D8A64B`
- Mint and sky support surfaces: `#DBEADF`, `#DCEBF2`
- Plus Jakarta Sans as the default UI font

This is intentionally small and reversible. Screen-level redesign should happen after the upstream feature merge plan is broken into reviewable slices.
