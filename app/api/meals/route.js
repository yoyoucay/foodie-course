import { NextResponse } from 'next/server';
import { getMealsBySlugs } from '@/lib/meals';
import { AppError } from '@/lib/errors';

// D1 access needs a live Worker request context — don't let `next build`
// try to prerender/optimize this statically.
export const dynamic = 'force-dynamic';

// GET /api/meals?slugs=a,b,c — used by the client-side favorites page to
// resolve saved slugs (localStorage) into full meal records.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slugs = (searchParams.get('slugs') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 100);

  if (slugs.length === 0) {
    return NextResponse.json({ meals: [] });
  }

  try {
    const meals = await getMealsBySlugs(slugs);
    return NextResponse.json({ meals });
  } catch (error) {
    const status = error instanceof AppError ? error.status : 500;
    return NextResponse.json({ error: 'Failed to load favorite meals' }, { status });
  }
}
