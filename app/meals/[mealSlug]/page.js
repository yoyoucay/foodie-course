import Image from "next/image";
import classes from "./page.module.css";
import { getMeal } from "@/lib/meals";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const meal = await getMeal(params.mealSlug); 
  if (!meal) {
    notFound();
  }
  return {
    title: `${meal.title} - Foodie`,
    description: meal.summary,
    openGraph: {
      title: meal.title,
      description: meal.summary,
      images: [`https://${process.env.AWS_ADDRESS_BUCKET_NAME}/${meal.image}`],
    },
  };
}

export default async function MealsDetailPage({ params }) {
  const meal = await getMeal(params.mealSlug); 

  if (!meal) {
    notFound();
  }

  meal.instructions = meal.instructions.replace(/\n/g, "<br/>");
  
  const totalTime = (meal.prep_time || 0) + (meal.cook_time || 0);
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: meal.title,
    description: meal.summary,
    image: `https://${process.env.AWS_ADDRESS_BUCKET_NAME}/${meal.image}`,
    author: {
      '@type': 'Person',
      name: meal.creator,
    },
    prepTime: meal.prep_time ? `PT${meal.prep_time}M` : undefined,
    cookTime: meal.cook_time ? `PT${meal.cook_time}M` : undefined,
    totalTime: totalTime ? `PT${totalTime}M` : undefined,
    recipeYield: meal.servings || 1,
    recipeCategory: meal.category,
    recipeInstructions: meal.instructions.replace(/<br\/>/g, ' '),
    recipeIngredient: meal.ingredients ? meal.ingredients.split(',').map(i => i.trim()) : [],
  };
  
  const difficultyColors = {
    easy: '#4caf50',
    medium: '#ff9800',
    hard: '#f44336',
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className={classes.header}>
        <div className={classes.image}>
          <Image
            src={`https://${process.env.AWS_ADDRESS_BUCKET_NAME}/${meal.image}`}
            alt={meal.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={85}
            priority
          />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
          
          <div className={classes.mealInfo}>
            {meal.prep_time > 0 && (
              <div className={classes.infoItem}>
                <span className={classes.infoLabel}>Prep:</span>
                <span>{meal.prep_time} min</span>
              </div>
            )}
            {meal.cook_time > 0 && (
              <div className={classes.infoItem}>
                <span className={classes.infoLabel}>Cook:</span>
                <span>{meal.cook_time} min</span>
              </div>
            )}
            {totalTime > 0 && (
              <div className={classes.infoItem}>
                <span className={classes.infoLabel}>Total:</span>
                <span className={classes.infoHighlight}>{totalTime} min</span>
              </div>
            )}
            {meal.servings && (
              <div className={classes.infoItem}>
                <span className={classes.infoLabel}>Servings:</span>
                <span>{meal.servings}</span>
              </div>
            )}
            {meal.difficulty && (
              <div className={classes.infoItem}>
                <span className={classes.infoLabel}>Difficulty:</span>
                <span 
                  className={classes.difficulty} 
                  style={{ color: difficultyColors[meal.difficulty] || '#fff' }}
                >
                  {meal.difficulty.charAt(0).toUpperCase() + meal.difficulty.slice(1)}
                </span>
              </div>
            )}
            {meal.views > 0 && (
              <div className={classes.infoItem}>
                <span className={classes.infoLabel}>Views:</span>
                <span>{meal.views}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={classes.main}>
        {meal.ingredients && (
          <section className={classes.section}>
            <h2>Ingredients</h2>
            <ul className={classes.ingredientsList}>
              {meal.ingredients.split(',').map((ingredient, index) => (
                <li key={index}>{ingredient.trim()}</li>
              ))}
            </ul>
          </section>
        )}

        <section className={classes.section}>
          <h2>Instructions</h2>
          <p
            className={classes.instructions}
            dangerouslySetInnerHTML={{
              __html: meal.instructions,
            }}
          ></p>
        </section>
      </main>
    </>
  );
}