import classes from './page.module.css';
import ShareMealForm from '@/components/meals/share-meal-form';
import { getCategories } from '@/lib/meals';

// getCategories() needs a live Worker request context (D1 binding), which
// isn't available during `next build`'s static prerendering — force this
// route to render per-request instead.
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Share a Recipe - Foodie',
  description: 'Share your favorite recipe with the Foodie community.',
  alternates: { canonical: '/meals/share' },
};

export default async function ShareMealPage() {
  const categories = await getCategories();

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other recipe you feel needs sharing.</p>
      </header>
      <main className={classes.main}>
        <ShareMealForm categories={categories} />
      </main>
    </>
  );
}
