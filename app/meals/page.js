import Link from 'next/link';
import classes from './page.module.css';
import MealsGrid from '@/components/meals/meals-grid';
import { getMeals } from '@/lib/meals';

export default async function MealsPage() {
    const meals = await getMeals();
    return (
        <>
            <header className={classes.header}>
                <h1>Delicious Meals <span className={classes.highlight}> by you</span></h1>
                <p>Choose your favorite dishes and enjoy a culinary adventure.</p>
                <p className={classes.cta}>
                    <Link href="/meals/share">
                    Share your favorite meal recipes with others!
                    </Link>
                </p>
            </header>
            <main className={classes.main}>
                <MealsGrid meals={meals} />
            </main>
        </>
    );
}