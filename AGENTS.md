# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: App Router routes, layouts, and server actions; keep shared UI logic out of this directory.
- `src/components`: Reusable shadcn/ui-based components; co-locate supporting types when practical.
- `src/lib` & `src/types`: Shared utilities and TypeScript contracts; update both when backend payloads change.
- `functions/src`: Firebase HTTPS functions for lead capture, compiled to `functions/lib` via `pnpm --filter functions run build`.
- `public` holds static assets; `supabase/migrations` carries SQL that must mirror production schema.

## Build, Test, and Development Commands
- `pnpm dev`: Start the Next.js dev server with Turbopack on port 3000.
- `pnpm build` / `pnpm start`: Produce and serve the production bundle; run these before Firebase deploys.
- `pnpm lint`, `pnpm type-check`, `pnpm format`: Enforce ESLint, TypeScript, and Prettier standards; run lint and type-check in CI, format locally.
- `pnpm --filter functions run build` and `firebase emulators:start --only functions`: Compile and emulate Cloud Functions when iterating on backend logic.

## Coding Style & Naming Conventions
- TypeScript everywhere; prefer explicit return types for exported functions and components.
- Follow Tailwind-first styling with semantic tokens defined in `@theme`; avoid ad-hoc hex colors.
- Components: use PascalCase filenames (`LeadForm.tsx`); hooks/utilities in camelCase (`useLeadCapture.ts`).
- Keep imports sorted: React, Next, third-party, internal alias (`@/`) last. Run Prettier before submitting changes.

## Testing Guidelines
- No automated suite is bundled; add Vitest or Playwright coverage for meaningful changes and check it into version control.
- Run `pnpm lint` and `pnpm type-check` on every branch, and validate lead submission through the Firebase emulator or staging.
- Name new test files `<Feature>.test.ts` alongside their targets for quick discovery.

## Commit & Pull Request Guidelines
- Use concise, imperative commit messages mirroring existing history (e.g., `ci: adjust deploy permissions`, `Add hero CTA animation`).
- Scope each pull request to one feature or fix; include a summary, risk notes, and Supabase/Firebase migration steps if relevant.
- Attach before/after screenshots or recordings for UI changes, and link tracking issues or task IDs in the PR description.

## Security & Configuration Tips
- Never commit `.env.local`; extend `.env.local.example` when adding variables and note requirements in your PR.
- Store Supabase keys and allowed origins with `firebase functions:secrets:set`, and verify them before deploying.
- Revisit `firebase.json` and `next.config.ts` after endpoint or domain changes to maintain CORS, rewrites, and analytics tags.
