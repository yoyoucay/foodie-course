import Link from "next/link";
import classes from "./page.module.css";
import ImageSlideshow from "@/components/images/image-slideshow";

export const metadata = {
  title: 'Home - Foodie',
  description: 'Experience the best food from the comfort of your home. Explore a wide variety of cuisines and dishes tailored to your taste.',
};

export default function Home() {
  return (
    <>
      <header className={classes.header}>
        <div className={classes.slideshow}>
          <ImageSlideshow />
        </div>
        <div>
          <div className={classes.hero}>
            <h1>Delicious Meals Delivered To You</h1>
            <p>
              Experience the best food from the comfort of your home. Explore a
              wide variety of cuisines and dishes tailored to your taste.
            </p>
          </div>
          <div className={classes.cta}>
            <Link href="/community" className={classes["cta-button"]}>
              Join the community
            </Link>
            <Link href="/meals" className={classes["cta-button"]}>
              Explore Meals
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className={classes.section}>
          <h2>How it works</h2>
          <p>
            Foodie is a platform for foodies to share their favorite
            recipes with the world. It&apos;s a place to discover new dishes,
            and to connect with other food lovers.
          </p>
          <p>
            Browse our extensive collection of recipes, share your culinary creations,
            and join a vibrant community of food enthusiasts from around the globe.
          </p>
        </section>

        <section className={classes.section}>
          <h2>Why Foodie?</h2>
          <p>
            Connect with passionate home chefs and professional cooks who share
            detailed recipes, cooking tips, and culinary secrets.
          </p>
          <p>
            From quick weeknight dinners to elaborate weekend feasts, find
            inspiration for every occasion and skill level.
          </p>
        </section>
      </main>
    </>
  );
}