"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isInvalidText(text) {
  return !text || text.trim() === "";
}

function isValidEmail(email) {
  return email && email.includes("@") && email.includes(".");
}

function isValidNumber(num) {
  return !isNaN(num) && num > 0;
}

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    ingredients: formData.get("ingredients"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
    prep_time: parseInt(formData.get("prep_time")) || 0,
    cook_time: parseInt(formData.get("cook_time")) || 0,
    servings: parseInt(formData.get("servings")) || 1,
    difficulty: formData.get("difficulty") || "medium",
    category: formData.get("category") || "other",
    tags: formData.get("tags") || "",
  };

  // Validation
  const errors = {};

  if (isInvalidText(meal.title)) {
    errors.title = "Title is required";
  }

  if (isInvalidText(meal.summary)) {
    errors.summary = "Summary is required";
  }

  if (isInvalidText(meal.instructions)) {
    errors.instructions = "Instructions are required";
  }

  if (isInvalidText(meal.ingredients)) {
    errors.ingredients = "Ingredients are required";
  }

  if (isInvalidText(meal.creator)) {
    errors.creator = "Your name is required";
  }

  if (!isValidEmail(meal.creator_email)) {
    errors.creator_email = "Please provide a valid email address";
  }

  if (!meal.image || meal.image.size === 0) {
    errors.image = "Please upload an image";
  }

  if (meal.image && meal.image.size > 5 * 1024 * 1024) {
    errors.image = "Image must be less than 5MB";
  }

  if (meal.image && !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(meal.image.type)) {
    errors.image = "Image must be JPEG, PNG, or WebP format";
  }

  if (meal.prep_time < 0 || meal.cook_time < 0 || meal.servings < 1) {
    errors.general = "Please check prep time, cook time, and servings";
  }

  if (Object.keys(errors).length > 0) {
    return {
      message: Object.values(errors)[0],
      errors,
    };
  }

  try {
    await saveMeal(meal);
    revalidatePath("/meals");
  } catch (error) {
    return {
      message: "Failed to save meal. Please try again.",
      errors: { general: error.message },
    };
  }

  redirect("/meals");
}
