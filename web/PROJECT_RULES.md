# Project Rules (AI Curriculum)

## Architecture
- Server reads live in `src/app/**/page.tsx` (Server Components).
- Server writes live in `src/app/**/actions.ts` (Server Actions).
- DB code lives in `src/db/**` and must NOT be imported into `"use client"` components.
- Reusable UI primitives live in `src/components/ui`.
- Domain UI components live in `src/components/<domain>` (e.g. `entries/`).

## Data flow
- Reads: server page fetches from DB and passes plain JSON-ish data to client components.
- Writes: client calls server actions, then uses `router.refresh()` to get fresh server-rendered state.

## When to use API routes
- Keep `/api/**` only for external clients, integrations, or legacy access.
- The UI should prefer Server Actions.

## Drizzle + schema
- Schema changes require:
  1) `npm run db:generate`
  2) commit migrations
  3) `npm run db:push` once per database

## Code style
- Prefer small components with clear props.
- Avoid clever abstractions early; optimize for readability.
