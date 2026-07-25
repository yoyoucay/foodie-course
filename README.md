# Foodie - Recipe Sharing Platform

Next.js 16 recipe sharing app running on Cloudflare Workers, with D1 (SQLite) for data and R2 for image storage.

## Features

- Recipe browsing with search, category, and difficulty filters (debounced, URL-driven)
- Pagination on the meals list
- Star ratings (one vote per browser per meal, cookie-enforced)
- Favorites/bookmarks stored in localStorage, no account required
- Recipe submission with per-field validation and image upload to R2
- Recipe JSON-LD structured data (schema.org `Recipe`) for search engines

## Stack

| Concern | Service |
|---|---|
| Hosting | Cloudflare Workers (via `@opennextjs/cloudflare`) |
| Database | Cloudflare D1 (SQLite) |
| Image storage | Cloudflare R2 |
| Framework | Next.js 16, React 19 |

## Prerequisites

- Node.js 20+
- A Cloudflare account
- `wrangler` (installed as a dev dependency, run via `npx wrangler` or the npm scripts below)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Authenticate wrangler:

```bash
npx wrangler login
```

3. Create the D1 database:

```bash
npx wrangler d1 create foodie-course-db
```

Copy the returned `database_id` into `wrangler.jsonc` under `d1_databases[0].database_id`.

4. Create the R2 bucket:

```bash
npx wrangler r2 bucket create foodie-course-images
```

Enable public access on the bucket (Cloudflare dashboard → R2 → your bucket → Settings → Public access, or attach a custom domain), then set the resulting URL as `NEXT_PUBLIC_R2_PUBLIC_URL` in `wrangler.jsonc` (`vars`) and in a local `.env.local` for `next dev`.

5. Run migrations and seed data:

```bash
npm run db:migrate:local
npm run db:seed:local
node scripts/upload-seed-images.mjs --remote
```

D1 stays local for fast dev iteration, but the image bytes must go to the real R2 bucket (`--remote`) — your public custom domain only serves the actual bucket, not local dev's emulated storage.

6. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_R2_PUBLIC_URL` | `wrangler.jsonc` vars + `.env.local` | Public base URL for R2-hosted images |

The D1 (`DB`) and R2 (`MEALS_BUCKET`) bindings are declared in `wrangler.jsonc` and injected automatically — no connection strings or access keys to manage.

## Deploying

```bash
npm run db:migrate:remote   # apply schema to the production D1 database
npm run deploy              # build with OpenNext and deploy the Worker
```

`npm run preview` builds and runs the Worker locally against your Cloudflare bindings before deploying.

## Project structure

```
app/                    Next.js App Router pages
  api/meals/            JSON endpoint used by the favorites page
  favorites/            Client-rendered favorites page
  meals/                Meals list, detail, and share pages
components/             UI components, colocated CSS modules
lib/
  db.js                 D1 binding accessor
  storage.js             R2 binding accessor + image URL helper
  meals.js               Data access (D1 queries)
  actions.js              Server actions (share, rate)
  errors.js               Custom exception classes
  hooks/use-favorites.js  localStorage-backed favorites hook
migrations/0001_init.sql  D1 schema
db/seed.sql               Sample data
scripts/upload-seed-images.mjs  Pushes assets/*.jpg into R2 for the seed data
wrangler.jsonc             Cloudflare bindings and Worker config
open-next.config.ts        OpenNext build config
```

## Database schema

**meals**: `id`, `slug`, `title`, `image` (R2 key), `summary`, `instructions`, `creator`, `creator_email`, `prep_time`, `cook_time`, `servings`, `difficulty`, `category`, `ingredients`, `tags`, `views`, `rating_sum`, `rating_count`, `created_at`.

**categories**: `id`, `name`, `slug`, `description`, `icon`.

See `migrations/0001_init.sql` for exact types and indexes.

## Security

- Server-side validation on every field of the share form, with per-field error messages
- XSS sanitization on user-submitted instructions
- Parameterized D1 queries (no string-built SQL)
- Image type/size validation before upload (JPEG/PNG/WebP, 5MB max)
- Rating writes are rejected with a `ValidationError` for out-of-range values; double-voting is blocked by a same-site cookie

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Next.js production build |
| `npm run preview` | Build with OpenNext and preview against Cloudflare bindings |
| `npm run deploy` | Build and deploy to Cloudflare Workers |
| `npm run db:migrate:local` / `:remote` | Apply D1 migrations |
| `npm run db:seed:local` / `:remote` | Load `db/seed.sql` |
| `npm run lint` | ESLint |
| `npm run lighthouse:local` | Run Lighthouse against a running local server |

## License

Educational project, originally built as part of a Next.js course.
