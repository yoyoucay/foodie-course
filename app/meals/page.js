import { Suspense } from "react";
import Link from "next/link";
import classes from "./page.module.css";
import MealsGrid from "@/components/meals/meals-grid";
import MealsFilter from "@/components/meals-filter/meals-filter";
import { getMeals, getMealsCount, getCategories } from "@/lib/meals";

export const metadata = {
  title: 'Browse Meals - Foodie',
  description: 'Browse and discover delicious meals shared by our food-loving community. Find your next favorite recipe.',
};

async function Meals({ searchParams }) {
  const options = {
    search: searchParams.search || '',
    category: searchParams.category || '',
    difficulty: searchParams.difficulty || '',
    limit: 50,
    offset: 0,
  };

  const meals = await getMeals(options);
  const total = await getMealsCount(options);

  if (meals.length === 0) {
    return (
      <div className={classes.noResults}>
        <p>No meals found matching your criteria.</p>
        <p>Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <>
      <p className={classes.resultCount}>Found {total} meal{total !== 1 ? 's' : ''}</p>
      <MealsGrid meals={meals} />
    </>
  );
}

export default async function MealsPage({ searchParams }) {
  const categories = await getCategories();

  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious Meals <span className={classes.highlight}>by you</span>
        </h1>
        <p>Choose your favorite dishes and enjoy a culinary adventure.</p>
        <p className={classes.cta}>
          <Link href="/meals/share">
            Share your favorite meal recipes!
          </Link>
        </p>
      </header>
      
      <MealsFilter categories={categories} />

      <main className={classes.main}>
        <Suspense 
          key={JSON.stringify(searchParams)} 
          fallback={<p className={classes.loading}>Loading meals...</p>}
        >
          <Meals searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}
