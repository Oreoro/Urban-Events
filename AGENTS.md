# Urban Events Merge Workspace

## Project Purpose
Upgrade `Muxoai/Urban-Events` using `HiEventsDev/Hi.Events` as the reference implementation while preserving Urban Events as the base repository that changes will be pushed back to.

The first product pass should improve the event platform UI/UX with a polished Mantine-based design system and a color direction aligned with `urbanevents.pk` after the merge and visual audit.

## Current Milestone
Establish a clean local merge workspace:

- Use Urban-Events as `origin` and the primary branch base.
- Add Hi.Events as an upstream/reference remote.
- Inspect both projects before changing code.
- Identify the smallest reversible merge path.
- Keep changes scoped, reviewable, and rollback-friendly.

## First User
Primary users are assumed to be event organizers/admins and ticket buyers using the public event discovery and ticketing flows. Revisit this if product priorities differ.

## Stack And Package Manager
Urban-Events is a Laravel 12/PHP backend with a Vite/React/TypeScript frontend using Mantine 8.

Use Yarn 1.x for the frontend because `frontend/yarn.lock` is present. Use Composer for the backend.

Keep the existing Hi.Events stack and package manager where it is being merged into Urban Events, unless repository inspection shows Urban Events intentionally diverged.

Do not switch frameworks, package managers, UI libraries, or build tooling without a concrete migration reason.

## Repository Layout
This workspace started as an empty Git repository. Current setup:

- `origin`: `https://github.com/Muxoai/Urban-Events.git`
- `hievents`: `https://github.com/HiEventsDev/Hi.Events.git`
- Application directories and commands must be confirmed from checked-out repository metadata before implementation.

## Commands
Run commands from their owning subdirectory unless noted.

- Frontend install: `cd frontend && yarn install --frozen-lockfile`
- Frontend CSR dev: `cd frontend && yarn dev:csr`
- Frontend SSR dev: `cd frontend && yarn dev:ssr`
- Frontend build: `cd frontend && yarn build`
- Frontend lint: `cd frontend && yarn lint`
- Frontend typecheck/build smoke: `cd frontend && yarn build-strict:csr`
- Backend install: `cd backend && composer install`
- Backend CLI: `cd backend && php artisan`
- Docker quick start: inspect `docker/all-in-one` and `docker/development` before use; do not deploy or alter live services without approval.

## UI/UX Direction
Use Mantine as the design-system foundation where it already exists.

UI work should prioritize:

- Consistent theme tokens for color, radius, typography, spacing, shadows, and component states.
- A polished but operational interface for event management and ticket purchasing.
- Clear hierarchy, dense-but-readable admin screens, accessible contrast, and responsive layouts.
- Color alignment with `urbanevents.pk` after auditing the current brand/site palette.
- Use the audited UrbanEvents palette as the default app shell direction: cream canvas, deep green/plum primary, coral accent, marigold highlight, mint and sky supporting surfaces.

Avoid broad redesign churn before the merge shape is understood.

## Dependency Policy
Prefer existing project dependencies and established local patterns.

Add production dependencies only when they remove meaningful complexity or are already part of the upstream Hi.Events approach being adopted. Document any new dependency and why it is needed.

## Safety And Approvals
Explicit user approval is required before:

- Deploying or publishing anything.
- Pushing to protected/default branches.
- Opening or merging a pull request.
- Running production migrations or touching production data.
- Creating, rotating, or exposing secrets.
- Changing billing, live integrations, or external service configuration.

Local git branches, local builds, local tests, and local reversible code changes are allowed.

## Domain Notes
This is not assumed to be a Shopify project. Apply Shopify-specific tooling or rules only if repository inspection proves the project is Shopify-related or the user explicitly says so.

For GitHub publishing, use a reviewable branch and prefer a pull request back to `Muxoai/Urban-Events` unless the user explicitly requests a direct push.

## Definition Of Done For First Pass
The first pass is done when:

- Urban-Events and Hi.Events remotes are configured locally.
- The active base branch is identified.
- The stack, package manager, and core commands are documented.
- A merge/audit plan identifies high-risk conflicts and UI system touchpoints.
- The first small implementation step is completed and verified locally where possible.

## Verification Checklist
Before reporting completion:

- Show `git status --short --branch`.
- Confirm remotes with `git remote -v`.
- Run available build/lint/typecheck/test commands once known.
- If commands cannot run, document the missing prerequisite or failure.
- Summarize changed files and rollback guidance.
