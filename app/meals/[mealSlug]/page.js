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
    recipeInstructions: meal.instructions.replace(/<br\/>/g, ' '),
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
        </div>
      </header>

      <main>
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{
            __html: meal.instructions,
          }}
        ></p>
      </main>
    </>
  );
}