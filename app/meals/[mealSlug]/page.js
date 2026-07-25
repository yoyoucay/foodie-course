import Image from 'next/image';
import { notFound } from 'next/navigation';
import classes from './page.module.css';
import { getMeal } from '@/lib/meals';
import { getImageUrl } from '@/lib/storage';
import { SITE_URL } from '@/lib/site';
import StarRating from '@/components/meals/star-rating';
import RatingWidget from '@/components/meals/rating-widget';
import FavoriteButton from '@/components/meals/favorite-button';

// D1 access needs a live Worker request context — don't let `next build`
// try to prerender this statically (there's no generateStaticParams here
// anyway, but this also disables the "unknown params" static shell).
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  // Next.js 15+: params is a Promise and must be awaited before use.
  const { mealSlug } = await params;
  const meal = await getMeal(mealSlug);
  if (!meal) {
    notFound();
  }
  return {
    title: `${meal.title} - Foodie`,
    description: meal.summary,
    alternates: { canonical: `/meals/${meal.slug}` },
    keywords: [meal.category, meal.difficulty, ...(meal.tags ? meal.tags.split(',') : [])]
      .map((t) => t?.trim())
      .filter(Boolean)
      .join(', '),
    openGraph: {
      title: meal.title,
      description: meal.summary,
      url: `${SITE_URL}/meals/${meal.slug}`,
      type: 'article',
      images: [{ url: getImageUrl(meal.image) }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meal.title,
      description: meal.summary,
      images: [getImageUrl(meal.image)],
    },
  };
}

const DIFFICULTY_COLORS = {
  easy: '#4b7f52',
  medium: '#b5842e',
  hard: '#b5482b',
};

export default async function MealsDetailPage({ params }) {
  const { mealSlug } = await params;
  const meal = await getMeal(mealSlug);

  if (!meal) {
    notFound();
  }

  const steps = meal.instructions
    .split(/\n+/)
    .map((step) => step.trim().replace(/^\d+\.\s*/, ''))
    .filter(Boolean);

  const ingredients = meal.ingredients
    ? meal.ingredients.split(',').map((i) => i.trim()).filter(Boolean)
    : [];

  const totalTime = (meal.prep_time || 0) + (meal.cook_time || 0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: meal.title,
    description: meal.summary,
    image: getImageUrl(meal.image),
    url: `${SITE_URL}/meals/${meal.slug}`,
    author: { '@type': 'Person', name: meal.creator },
    prepTime: meal.prep_time ? `PT${meal.prep_time}M` : undefined,
    cookTime: meal.cook_time ? `PT${meal.cook_time}M` : undefined,
    totalTime: totalTime ? `PT${totalTime}M` : undefined,
    recipeYield: meal.servings || 1,
    recipeCategory: meal.category,
    recipeInstructions: steps,
    recipeIngredient: ingredients,
    aggregateRating:
      meal.rating_count > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: (meal.rating_sum / meal.rating_count).toFixed(1),
            reviewCount: meal.rating_count,
          }
        : undefined,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Meals', item: `${SITE_URL}/meals` },
      { '@type': 'ListItem', position: 3, name: meal.title, item: `${SITE_URL}/meals/${meal.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <header className={classes.header}>
        <div className={classes.image}>
          <Image
            src={getImageUrl(meal.image)}
            alt={meal.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={85}
            priority
          />
        </div>
        <div className={classes.headerText}>
          <div className={classes.titleRow}>
            <h1>{meal.title}</h1>
            <FavoriteButton slug={meal.slug} title={meal.title} />
          </div>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <StarRating ratingSum={meal.rating_sum} ratingCount={meal.rating_count} size="lg" />
          <p className={classes.summary}>{meal.summary}</p>

          <div className={classes.mealInfo}>
            {meal.prep_time > 0 && (
              <div className={classes.infoItem}>
                <span className={classes.infoLabel}>Prep</span>
                <span>{meal.prep_time} min</span>
              </div>
            )}
            {meal.cook_time > 0 && (
              <div className={classes.infoItem}>
                <span className={classes.infoLabel}>Cook</span>
                <span>{meal.cook_time} min</span>
              </div>
            )}
            {totalTime > 0 && (
              <div className={classes.infoItem}>
                <span className={classes.infoLabel}>Total</span>
                <span className={classes.infoHighlight}>{totalTime} min</span>
              </div>
            )}
            {meal.servings && (
              <div className={classes.infoItem}>
                <span className={classes.infoLabel}>Servings</span>
                <span>{meal.servings}</span>
              </div>
            )}
            {meal.difficulty && (
              <div className={classes.infoItem}>
                <span className={classes.infoLabel}>Difficulty</span>
                <span
                  className={classes.difficulty}
                  style={{ color: DIFFICULTY_COLORS[meal.difficulty] || 'inherit' }}
                >
                  {meal.difficulty.charAt(0).toUpperCase() + meal.difficulty.slice(1)}
                </span>
              </div>
            )}
            {meal.views > 0 && (
              <div className={classes.infoItem}>
                <span className={classes.infoLabel}>Views</span>
                <span>{meal.views}</span>
              </div>
            )}
          </div>

          <RatingWidget slug={meal.slug} />
        </div>
      </header>

      <main className={classes.main}>
        {ingredients.length > 0 && (
          <section className={classes.section}>
            <h2>Ingredients</h2>
            <ul className={classes.ingredientsList}>
              {ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </section>
        )}

        <section className={classes.section}>
          <h2>Instructions</h2>
          <ol className={classes.instructions}>
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </section>
      </main>
    </>
  );
}
