'use client';
import ImagePicker from "@/components/meals/image-picker";
import classes from "./page.module.css";
import { shareMeal } from "@/lib/actions";
import MealsFormSubmit from "@/components/meals/meals-form-submit";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";

export default function ShareMealPage() {
  const [state, formAction] = useFormState(shareMeal, {message: null});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories([
      { slug: 'breakfast', name: 'Breakfast', icon: '🍳' },
      { slug: 'lunch', name: 'Lunch', icon: '🥗' },
      { slug: 'dinner', name: 'Dinner', icon: '🍽️' },
      { slug: 'desserts', name: 'Desserts', icon: '🍰' },
      { slug: 'snacks', name: 'Snacks', icon: '🍿' },
      { slug: 'beverages', name: 'Beverages', icon: '🥤' },
      { slug: 'vegetarian', name: 'Vegetarian', icon: '🥕' },
      { slug: 'vegan', name: 'Vegan', icon: '🌱' },
    ]);
  }, []);

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        <form className={classes.form} action={formAction} aria-label="Share meal form">
          <div className={classes.row}>
            <p>
              <label htmlFor="name">Your name</label>
              <input type="text" id="name" name="name" required aria-required="true" />
            </p>
            <p>
              <label htmlFor="email">Your email</label>
              <input type="email" id="email" name="email" required aria-required="true" />
            </p>
          </div>
          
          <p>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" required aria-required="true" />
          </p>
          
          <p>
            <label htmlFor="summary">Short Summary</label>
            <input type="text" id="summary" name="summary" required aria-required="true" />
          </p>

          <div className={classes.row}>
            <p>
              <label htmlFor="category">Category</label>
              <select id="category" name="category" required aria-required="true" className={classes.select}>
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </p>
            <p>
              <label htmlFor="difficulty">Difficulty Level</label>
              <select id="difficulty" name="difficulty" required aria-required="true" className={classes.select}>
                <option value="">Select difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </p>
          </div>

          <div className={classes.row}>
            <p>
              <label htmlFor="prep_time">Prep Time (minutes)</label>
              <input type="number" id="prep_time" name="prep_time" min="0" placeholder="e.g., 15" required aria-required="true" />
            </p>
            <p>
              <label htmlFor="cook_time">Cook Time (minutes)</label>
              <input type="number" id="cook_time" name="cook_time" min="0" placeholder="e.g., 30" required aria-required="true" />
            </p>
            <p>
              <label htmlFor="servings">Servings</label>
              <input type="number" id="servings" name="servings" min="1" placeholder="e.g., 4" required aria-required="true" />
            </p>
          </div>

          <p>
            <label htmlFor="ingredients">
              Ingredients 
              <span className={classes.hint}>(separate each ingredient with a comma)</span>
            </label>
            <textarea id="ingredients" name="ingredients" rows="5" placeholder="e.g., 2 cups flour, 1 tsp salt, 3 eggs, 1 cup milk" required aria-required="true"></textarea>
          </p>
          
          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea id="instructions" name="instructions" rows="10" placeholder="Describe step-by-step how to prepare this meal..." required aria-required="true"></textarea>
          </p>

          <p>
            <label htmlFor="tags">
              Tags 
              <span className={classes.hint}>(optional, separate with commas)</span>
            </label>
            <input type="text" id="tags" name="tags" placeholder="e.g., quick, budget-friendly, gluten-free" />
          </p>
          
          <ImagePicker label="Your Image" name="image" />
          
          {state.message && <p className={classes.error} role="alert">{state.message}</p>}
          
          <p className={classes.actions}>
            <MealsFormSubmit />
          </p>
        </form>
      </main>
    </>
  );
}