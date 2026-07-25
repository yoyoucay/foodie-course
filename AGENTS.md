# AGENTS.md

Foodie is a Next.js 16 (React 19) recipe-sharing app running on Cloudflare
Workers, with D1 (SQLite) for data and R2 for image storage. This file
orients any agent (human or AI) picking up work on it.

## Startup Workflow

Before writing code:

1. **Confirm working directory** with `pwd`
2. **Read this file** completely
3. **Read `README.md`** for the full setup/deploy story
4. **Run `./init.sh`** to verify environment is healthy
5. **Read `feature_list.json`** to see current feature state
6. **Read `progress.md`** for the latest session's context
7. **Review recent commits** with `git log --oneline -10`

If baseline verification is failing, repair that first before adding new scope.

## Working Rules

- **One feature at a time**: pick exactly one unfinished item from `feature_list.json`.
- **Verification required**: don't claim done without actually running `npm run lint` and `npm run build`.
- **D1/R2 access needs a live Worker request context.** Any route/page that calls into `lib/meals.js`, `lib/db.js`, or `lib/storage.js` must export `export const dynamic = 'force-dynamic';` — otherwise `next build` tries to prerender it statically and fails with `getCloudflareContext` errors (see `app/meals/share/page.js` for the pattern). This bit us once already; check it whenever adding a new data-backed route.
- **Update artifacts**: before ending a session, update `progress.md` and `feature_list.json`.
- **Stay in scope**: don't modify files unrelated to the current feature.
- **Leave clean state**: next session must be able to run `./init.sh` immediately.

## Required Artifacts

- `feature_list.json` — feature state tracker (source of truth)
- `progress.md` — session continuity log
- `init.sh` — standard startup and verification path
- `session-handoff.md` — hand-off for the next session

## Definition of Done

A feature is done only when ALL of the following are true:

- [ ] Target behavior is implemented
- [ ] `npm run lint` and `npm run build` both pass
- [ ] Manually exercised via `npm run dev` (this project has no automated test suite yet)
- [ ] Evidence recorded in `feature_list.json`
- [ ] Repository remains restartable from `./init.sh`

## End of Session

1. Update `progress.md` with current state.
2. Update `feature_list.json` with new feature status.
3. Record any unresolved risks or blockers.
4. Commit with a descriptive message once work is in a safe state.
5. Leave the repo clean enough for the next session to run `./init.sh` immediately.

## Verification Commands

```bash
# Full verification (recommended)
npm run lint && npm run build
```

Other useful commands:
- `npm run dev` — local dev server (requires `.env.local` with `NEXT_PUBLIC_R2_PUBLIC_URL`; D1/R2 bindings come from `wrangler.jsonc` via `initOpenNextCloudflareForDev()`)
- `npm run db:migrate:local` / `:remote` — apply D1 schema
- `npm run db:seed:local` / `:remote` — load `db/seed.sql`
- `node scripts/upload-seed-images.mjs --remote` — push demo images into the real R2 bucket (local dev's emulated R2 is invisible to the public custom domain)
- `npm run preview` — OpenNext build + local preview against real Cloudflare bindings
- `npm run deploy` — OpenNext build + `wrangler deploy`

## Escalation

- **Architecture decisions**: check `README.md` first, otherwise ask the user.
- **Cloudflare dashboard state** (R2 public access, custom domains, D1 contents): the Cloudflare MCP connector's tools (`r2_bucket_get`, `d1_databases_list`, etc.) only expose bucket/database metadata, not object listings or custom-domain status — verify those visually in the dashboard or via a live HTTP request, don't assume the API reflects reality.
- **Repeated build/deploy failures**: update `progress.md`, flag for human review.
- **Scope ambiguity**: re-read `feature_list.json` for definition of done.
