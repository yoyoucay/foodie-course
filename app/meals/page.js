import { Suspense } from "react";
import Link from "next/link";
import classes from "./page.module.css";
import MealsGrid from "@/components/meals/meals-grid";
import { getMeals } from "@/lib/meals";

async function Meals() {
  const meals = await getMeals();
  return <MealsGrid meals={meals} />;
}

export default async function MealsPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious Meals <span className={classes.highlight}> by you</span>
        </h1>
        <p>Choose your favorite dishes and enjoy a culinary adventure.</p>
        <p className={classes.cta}>
          <Link href="/meals/share">
            Share your favorite meal recipes!
          </Link>
        </p>
      </header>
      <main className={classes.main}>
        <Suspense fallback={<p className={classes.loading}>Loading meals...</p>}>
          <Meals />
        </Suspense>
      </main>
    </>
  );
}
