import Link from 'next/link';
import classes from './page.module.css';
import ImageSlideshow from '@/components/images/image-slideshow';

export const metadata = {
  title: 'Home - Foodie',
  description: 'Experience the best food from the comfort of your home. Explore a wide variety of cuisines and dishes tailored to your taste.',
  alternates: { canonical: '/' },
};

const STEPS = [
  {
    title: 'Browse',
    body: 'Filter hundreds of community recipes by category, difficulty, or what’s in your fridge.',
  },
  {
    title: 'Cook',
    body: 'Follow clear step-by-step instructions with prep time, cook time, and servings up front.',
  },
  {
    title: 'Share',
    body: 'Post your own recipe with photos, ingredients, and tags for others to discover.',
  },
];

export default function Home() {
  return (
    <>
      <header className={classes.header}>
        <div className={classes.slideshow}>
          <ImageSlideshow />
        </div>
        <div className={classes.heroCol}>
          <p className={classes.eyebrow}>A recipe-sharing community</p>
          <h1>Cook something worth sharing</h1>
          <p className={classes.lede}>
            Browse recipes from home cooks around the world, save the ones you
            love, and share your own creations with the Foodie community.
          </p>
          <div className={classes.cta}>
            <Link href="/meals" className={classes.primaryButton}>
              Explore meals
            </Link>
            <Link href="/community" className={classes.secondaryButton}>
              Join the community
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className={classes.section}>
          <h2>How it works</h2>
          <ol className={classes.steps}>
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className={classes.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </>
  );
}
