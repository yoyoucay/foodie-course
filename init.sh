#!/bin/bash
set -e

echo "=== Harness Initialization: foodie-course ==="

echo "=== Installing dependencies (npm) ==="
npm install

echo "=== Lint ==="
npm run lint

echo "=== Build ==="
npm run build

echo "=== Verification Complete ==="
echo ""
echo "Notes:"
echo "- No automated test suite exists yet. Manual verification means running"
echo "  'npm run dev' and checking /, /meals, /meals/[slug], /meals/share,"
echo "  and /favorites in a browser."
echo "- D1/R2 access (lib/db.js, lib/storage.js) only works inside a live"
echo "  Cloudflare Worker request context. Any data-backed route/page needs"
echo "  'export const dynamic = \"force-dynamic\";' or 'npm run build' fails"
echo "  trying to prerender it statically. See app/meals/share/page.js."
echo "- Deploying and seeding real data are separate from this build check:"
echo "  npm run db:migrate:remote && npm run db:seed:remote"
echo "  node scripts/upload-seed-images.mjs --remote"
echo "  npm run deploy"
echo ""
echo "Next steps:"
echo "1. Read feature_list.json to see current feature state"
echo "2. Pick ONE unfinished feature to work on"
echo "3. Implement only that feature"
echo "4. Re-run 'npm run lint && npm run build' before claiming done"
