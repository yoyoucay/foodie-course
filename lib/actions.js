'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { saveMeal, rateMeal as rateMealInDb } from './meals';
import { ValidationError } from './errors';

function isInvalidText(text) {
  return !text || text.trim() === '';
}

function isValidEmail(email) {
  return email && email.includes('@') && email.includes('.');
}

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    ingredients: formData.get('ingredients'),
    image: formData.get('image'),
    creator: formData.get('name'),
    creator_email: formData.get('email'),
    prep_time: parseInt(formData.get('prep_time')) || 0,
    cook_time: parseInt(formData.get('cook_time')) || 0,
    servings: parseInt(formData.get('servings')) || 1,
    difficulty: formData.get('difficulty') || 'medium',
    category: formData.get('category') || 'other',
    tags: formData.get('tags') || '',
  };

  const errors = {};

  if (isInvalidText(meal.title)) errors.title = 'Title is required';
  if (isInvalidText(meal.summary)) errors.summary = 'Summary is required';
  if (isInvalidText(meal.instructions)) errors.instructions = 'Instructions are required';
  if (isInvalidText(meal.ingredients)) errors.ingredients = 'Ingredients are required';
  if (isInvalidText(meal.creator)) errors.creator = 'Your name is required';
  if (!isValidEmail(meal.creator_email)) errors.creator_email = 'Please provide a valid email address';
  if (!meal.image || meal.image.size === 0) errors.image = 'Please upload an image';
  if (meal.prep_time < 0 || meal.cook_time < 0 || meal.servings < 1) {
    errors.general = 'Please check prep time, cook time, and servings';
  }

  if (Object.keys(errors).length > 0) {
    return { message: Object.values(errors)[0], errors };
  }

  try {
    await saveMeal(meal);
  } catch (error) {
    if (error instanceof ValidationError) {
      return { message: error.message, errors: error.fieldErrors };
    }
    return {
      message: 'Failed to save meal. Please try again.',
      errors: { general: 'Something went wrong on our end.' },
    };
  }

  revalidatePath('/meals');
  redirect('/meals');
}

export async function rateMeal(slug, rating) {
  // Next.js 15+: cookies() is async and must be awaited before use.
  const cookieStore = await cookies();
  const cookieName = `rated_${slug}`;

  if (cookieStore.get(cookieName)) {
    return { success: false, message: "You've already rated this meal." };
  }

  try {
    await rateMealInDb(slug, rating);
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'Failed to save your rating. Please try again.' };
  }

  cookieStore.set(cookieName, '1', {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  });

  revalidatePath(`/meals/${slug}`);
  return { success: true, message: 'Thanks for rating!' };
}
