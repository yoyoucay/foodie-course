'use client';

import { useActionState } from 'react';
import ImagePicker from '@/components/meals/image-picker';
import MealsFormSubmit from '@/components/meals/meals-form-submit';
import { shareMeal } from '@/lib/actions';
import classes from './share-meal-form.module.css';

const initialState = { message: null, errors: {} };

function FieldError({ errors, field }) {
  if (!errors?.[field]) return null;
  return (
    <span className={classes.fieldError} role="alert">
      {errors[field]}
    </span>
  );
}

export default function ShareMealForm({ categories }) {
  const [state, formAction] = useActionState(shareMeal, initialState);
  const errors = state.errors || {};

  return (
    <form className={classes.form} action={formAction} aria-label="Share meal form" noValidate>
      <div className={classes.row}>
        <p>
          <label htmlFor="name">Your name</label>
          <input type="text" id="name" name="name" required aria-required="true" />
          <FieldError errors={errors} field="creator" />
        </p>
        <p>
          <label htmlFor="email">Your email</label>
          <input type="email" id="email" name="email" required aria-required="true" />
          <FieldError errors={errors} field="creator_email" />
        </p>
      </div>

      <p>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" required aria-required="true" />
        <FieldError errors={errors} field="title" />
      </p>

      <p>
        <label htmlFor="summary">Short summary</label>
        <input type="text" id="summary" name="summary" required aria-required="true" />
        <FieldError errors={errors} field="summary" />
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
          <label htmlFor="difficulty">Difficulty level</label>
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
          <label htmlFor="prep_time">Prep time (minutes)</label>
          <input type="number" id="prep_time" name="prep_time" min="0" placeholder="e.g., 15" required aria-required="true" />
        </p>
        <p>
          <label htmlFor="cook_time">Cook time (minutes)</label>
          <input type="number" id="cook_time" name="cook_time" min="0" placeholder="e.g., 30" required aria-required="true" />
        </p>
        <p>
          <label htmlFor="servings">Servings</label>
          <input type="number" id="servings" name="servings" min="1" placeholder="e.g., 4" required aria-required="true" />
        </p>
      </div>
      <FieldError errors={errors} field="general" />

      <p>
        <label htmlFor="ingredients">
          Ingredients
          <span className={classes.hint}>(separate each ingredient with a comma)</span>
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          rows="5"
          placeholder="e.g., 2 cups flour, 1 tsp salt, 3 eggs, 1 cup milk"
          required
          aria-required="true"
        ></textarea>
        <FieldError errors={errors} field="ingredients" />
      </p>

      <p>
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          rows="10"
          placeholder="One step per line works best..."
          required
          aria-required="true"
        ></textarea>
        <FieldError errors={errors} field="instructions" />
      </p>

      <p>
        <label htmlFor="tags">
          Tags
          <span className={classes.hint}>(optional, separate with commas)</span>
        </label>
        <input type="text" id="tags" name="tags" placeholder="e.g., quick, budget-friendly, gluten-free" />
      </p>

      <ImagePicker label="Your image" name="image" />
      <FieldError errors={errors} field="image" />

      <p className={classes.actions}>
        <MealsFormSubmit />
      </p>
    </form>
  );
}
