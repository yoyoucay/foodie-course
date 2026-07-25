import slugify from 'slugify';
import xss from 'xss';
import { getDB } from './db';
import { uploadImage, isAllowedImageType, isImageTooLarge, MAX_IMAGE_SIZE_MB } from './storage';
import { DatabaseError, ValidationError } from './errors';

const VALID_SORT_COLUMNS = ['created_at', 'title', 'views', 'rating_sum'];
const VALID_SORT_ORDERS = ['ASC', 'DESC'];

function buildMealFilters({ search, category, difficulty }) {
  const clauses = [];
  const params = [];

  if (search) {
    // SQLite's LIKE is case-insensitive for ASCII by default, so no
    // lower()/ILIKE dance is needed here like it was for Postgres.
    clauses.push('(title LIKE ? OR summary LIKE ? OR ingredients LIKE ?)');
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  if (category) {
    clauses.push('category = ?');
    params.push(category);
  }

  if (difficulty) {
    clauses.push('difficulty = ?');
    params.push(difficulty);
  }

  return {
    where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    params,
  };
}

export async function getMeals(options = {}) {
  const {
    search = '',
    category = '',
    difficulty = '',
    limit = 12,
    offset = 0,
    sortBy = 'created_at',
    sortOrder = 'DESC',
  } = options;

  const { where, params } = buildMealFilters({ search, category, difficulty });
  const finalSortBy = VALID_SORT_COLUMNS.includes(sortBy) ? sortBy : 'created_at';
  const finalSortOrder = VALID_SORT_ORDERS.includes(sortOrder) ? sortOrder : 'DESC';

  const query = `
    SELECT * FROM meals
    ${where}
    ORDER BY ${finalSortBy} ${finalSortOrder}
    LIMIT ? OFFSET ?
  `;

  const db = await getDB();
  try {
    const { results } = await db.prepare(query).bind(...params, limit, offset).all();
    return results;
  } catch (cause) {
    throw new DatabaseError('Failed to load meals', cause);
  }
}

export async function getMealsCount(options = {}) {
  const { search = '', category = '', difficulty = '' } = options;
  const { where, params } = buildMealFilters({ search, category, difficulty });

  const db = await getDB();
  try {
    const row = await db
      .prepare(`SELECT COUNT(*) AS count FROM meals ${where}`)
      .bind(...params)
      .first();
    return row?.count ?? 0;
  } catch (cause) {
    throw new DatabaseError('Failed to count meals', cause);
  }
}

export async function getMeal(slug) {
  const db = await getDB();
  let meal;
  try {
    meal = await db.prepare('SELECT * FROM meals WHERE slug = ?').bind(slug).first();
    if (meal) {
      await db.prepare('UPDATE meals SET views = views + 1 WHERE slug = ?').bind(slug).run();
    }
  } catch (cause) {
    throw new DatabaseError(`Failed to load meal "${slug}"`, cause);
  }
  return meal;
}

export async function getMealsBySlugs(slugs) {
  if (!slugs?.length) return [];
  const db = await getDB();
  const placeholders = slugs.map(() => '?').join(',');
  try {
    const { results } = await db
      .prepare(`SELECT * FROM meals WHERE slug IN (${placeholders})`)
      .bind(...slugs)
      .all();
    return results;
  } catch (cause) {
    throw new DatabaseError('Failed to load meals by slug', cause);
  }
}

export async function getAllMealSlugs() {
  const db = await getDB();
  try {
    const { results } = await db
      .prepare('SELECT slug, created_at FROM meals ORDER BY created_at DESC')
      .all();
    return results;
  } catch (cause) {
    throw new DatabaseError('Failed to load meal slugs', cause);
  }
}

export async function getCategories() {
  const db = await getDB();
  try {
    const { results } = await db.prepare('SELECT * FROM categories ORDER BY name').all();
    return results;
  } catch (cause) {
    throw new DatabaseError('Failed to load categories', cause);
  }
}

export async function getMealsByCategory(category, limit = 20) {
  const db = await getDB();
  try {
    const { results } = await db
      .prepare('SELECT * FROM meals WHERE category = ? ORDER BY created_at DESC LIMIT ?')
      .bind(category, limit)
      .all();
    return results;
  } catch (cause) {
    throw new DatabaseError(`Failed to load meals for category "${category}"`, cause);
  }
}

export async function getPopularMeals(limit = 6) {
  const db = await getDB();
  try {
    const { results } = await db
      .prepare('SELECT * FROM meals ORDER BY views DESC LIMIT ?')
      .bind(limit)
      .all();
    return results;
  } catch (cause) {
    throw new DatabaseError('Failed to load popular meals', cause);
  }
}

export async function getRecentMeals(limit = 6) {
  const db = await getDB();
  try {
    const { results } = await db
      .prepare('SELECT * FROM meals ORDER BY created_at DESC LIMIT ?')
      .bind(limit)
      .all();
    return results;
  } catch (cause) {
    throw new DatabaseError('Failed to load recent meals', cause);
  }
}

export async function saveMeal(meal) {
  if (!isAllowedImageType(meal.image.type)) {
    throw new ValidationError('Image must be JPEG, PNG, or WebP format', {
      image: 'Unsupported image format',
    });
  }
  if (isImageTooLarge(meal.image.size)) {
    throw new ValidationError(`Image must be less than ${MAX_IMAGE_SIZE_MB}MB`, {
      image: 'Image too large',
    });
  }

  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}-${Date.now()}.${extension}`;
  await uploadImage(meal.image, fileName);
  meal.image = fileName;

  const db = await getDB();
  try {
    await db
      .prepare(
        `INSERT INTO meals
          (title, summary, instructions, creator, creator_email, image, slug,
           prep_time, cook_time, servings, difficulty, category, ingredients, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        meal.title,
        meal.summary,
        meal.instructions,
        meal.creator,
        meal.creator_email,
        meal.image,
        meal.slug,
        meal.prep_time || 0,
        meal.cook_time || 0,
        meal.servings || 1,
        meal.difficulty || 'medium',
        meal.category || 'other',
        meal.ingredients || '',
        meal.tags || ''
      )
      .run();
  } catch (cause) {
    if (String(cause?.message).includes('UNIQUE')) {
      throw new ValidationError('A meal with this title already exists', {
        title: 'Title must be unique',
      });
    }
    throw new DatabaseError('Failed to save meal to database', cause);
  }
}

export async function rateMeal(slug, rating) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ValidationError('Rating must be an integer between 1 and 5', {
      rating: 'Invalid rating',
    });
  }

  const db = await getDB();
  try {
    const result = await db
      .prepare(
        'UPDATE meals SET rating_sum = rating_sum + ?, rating_count = rating_count + 1 WHERE slug = ?'
      )
      .bind(rating, slug)
      .run();

    if (!result.meta || result.meta.changes === 0) {
      throw new ValidationError(`Meal "${slug}" was not found`, { slug: 'Unknown meal' });
    }
  } catch (cause) {
    if (cause instanceof ValidationError) throw cause;
    throw new DatabaseError(`Failed to save rating for "${slug}"`, cause);
  }
}
