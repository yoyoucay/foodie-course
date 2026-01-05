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
    title: meal ? meal.title : "Meal Not Found",
    description: meal ? meal.summary : "No meal found with the provided slug.",
  };
}

export default async function MealsDetailPage({ params }) {
  const meal = await getMeal(params.mealSlug); 

  if (!meal) {
    notFound();
  }

  meal.instructions = meal.instructions.replace(/\n/g, "<br/>");
  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image
            src={`https://${process.env.AWS_ADDRESS_BUCKET_NAME}/${meal.image}`}
            alt={meal.title}
            fill
          />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}> {meal.creator} </a>
          </p>
          <p className={classes.summary}> {meal.summary}</p>
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
