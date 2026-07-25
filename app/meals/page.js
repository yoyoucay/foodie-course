import { Suspense } from 'react';
import Link from 'next/link';
import classes from './page.module.css';
import MealsGrid from '@/components/meals/meals-grid';
import MealsFilter from '@/components/meals-filter/meals-filter';
import Pagination from '@/components/pagination/pagination';
import { getMeals, getMealsCount, getCategories } from '@/lib/meals';

// D1 access needs a live Worker request context — don't let `next build`
// try to prerender this statically.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }) {
  const resolved = await searchParams;
  const isFiltered = Boolean(resolved.search || resolved.category || resolved.difficulty);

  return {
    title: 'Browse Meals - Foodie',
    description: 'Browse and discover delicious meals shared by our food-loving community. Find your next favorite recipe.',
    // Canonicalize every filter/pagination combination to the bare listing —
    // faceted search URLs are near-duplicate content and shouldn't compete
    // with each other in search results.
    alternates: { canonical: '/meals' },
    // Filtered views are legitimate for visitors but not worth indexing as
    // distinct pages; keep them crawlable (follow) without polluting the index.
    robots: isFiltered ? { index: false, follow: true } : { index: true, follow: true },
  };
}

const PAGE_SIZE = 12;

async function Meals({ searchParams }) {
  const page = Math.max(1, parseInt(searchParams.page) || 1);
  const options = {
    search: searchParams.search || '',
    category: searchParams.category || '',
    difficulty: searchParams.difficulty || '',
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  };

  const [meals, total] = await Promise.all([getMeals(options), getMealsCount(options)]);

  if (meals.length === 0) {
    return (
      <div className={classes.noResults}>
        <p>No meals found matching your criteria.</p>
        <p>Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <p className={classes.resultCount}>
        {total} meal{total !== 1 ? 's' : ''} found
      </p>
      <MealsGrid meals={meals} />
      <Pagination currentPage={page} totalPages={totalPages} searchParams={searchParams} />
    </>
  );
}

export default async function MealsPage({ searchParams }) {
  // Next.js 15+: searchParams is a Promise and must be awaited before use.
  const resolvedSearchParams = await searchParams;
  const categories = await getCategories();

  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious meals, <span className={classes.highlight}>shared by you</span>
        </h1>
        <p>Browse recipes from the community, or add your own to the collection.</p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share a recipe →</Link>
        </p>
      </header>

      <MealsFilter categories={categories} />

      <main className={classes.main}>
        <Suspense
          key={JSON.stringify(resolvedSearchParams)}
          fallback={<p className={classes.loading}>Loading meals...</p>}
        >
          <Meals searchParams={resolvedSearchParams} />
        </Suspense>
      </main>
    </>
  );
}
