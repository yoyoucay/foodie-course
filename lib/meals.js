import { sql } from "@vercel/postgres";
import slugify from "slugify";
import xss from "xss";
import { S3 } from "@aws-sdk/client-s3";

const s3 = new S3({
  region: 'ap-southeast-2'
});

export async function getMeals(options = {}) {
  const {
    search = '',
    category = '',
    difficulty = '',
    limit = 100,
    offset = 0,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  } = options;

  let query = 'SELECT * FROM meals WHERE 1=1';
  const params = [];
  let paramIndex = 1;

  if (search) {
    query += ` AND (title ILIKE $${paramIndex} OR summary ILIKE $${paramIndex} OR ingredients ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (category) {
    query += ` AND category = $${paramIndex}`;
    params.push(category);
    paramIndex++;
  }

  if (difficulty) {
    query += ` AND difficulty = $${paramIndex}`;
    params.push(difficulty);
    paramIndex++;
  }

  // Add sorting
  const validSortColumns = ['created_at', 'title', 'views', 'rating_sum'];
  const validSortOrders = ['ASC', 'DESC'];
  
  const finalSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const finalSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : 'DESC';
  
  query += ` ORDER BY ${finalSortBy} ${finalSortOrder}`;

  // Add pagination
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const { rows } = await sql.query(query, params);
  return rows;
}

export async function getMealsCount(options = {}) {
  const { search = '', category = '', difficulty = '' } = options;

  let query = 'SELECT COUNT(*) FROM meals WHERE 1=1';
  const params = [];
  let paramIndex = 1;

  if (search) {
    query += ` AND (title ILIKE $${paramIndex} OR summary ILIKE $${paramIndex} OR ingredients ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (category) {
    query += ` AND category = $${paramIndex}`;
    params.push(category);
    paramIndex++;
  }

  if (difficulty) {
    query += ` AND difficulty = $${paramIndex}`;
    params.push(difficulty);
    paramIndex++;
  }

  const { rows } = await sql.query(query, params);
  return parseInt(rows[0].count);
}

export async function getMeal(slug) {
  const { rows } = await sql`SELECT * FROM meals WHERE slug = ${slug}`;
  
  // Increment view count
  if (rows[0]) {
    await sql`UPDATE meals SET views = views + 1 WHERE slug = ${slug}`;
  }
  
  return rows[0];
}

export async function getCategories() {
  const { rows } = await sql`SELECT * FROM categories ORDER BY name`;
  return rows;
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  const bufferedImage = await meal.image.arrayBuffer();

  try {
    await s3.putObject({
      Bucket: 'foodie-course-image',
      Key: fileName,
      Body: Buffer.from(bufferedImage),
      ContentType: meal.image.type,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }

  meal.image = fileName;

  try {
    await sql`
      INSERT INTO meals 
        (title, summary, instructions, creator, creator_email, image, slug, 
         prep_time, cook_time, servings, difficulty, category, ingredients, tags) 
      VALUES (
        ${meal.title},
        ${meal.summary},
        ${meal.instructions},
        ${meal.creator},
        ${meal.creator_email},
        ${meal.image},
        ${meal.slug},
        ${meal.prep_time || 0},
        ${meal.cook_time || 0},
        ${meal.servings || 1},
        ${meal.difficulty || 'medium'},
        ${meal.category || 'other'},
        ${meal.ingredients || ''},
        ${meal.tags || ''}
      )
    `;
  } catch (error) {
    console.error('Error saving meal:', error);
    throw new Error('Failed to save meal to database');
  }
}

export async function getMealsByCategory(category) {
  const { rows } = await sql`
    SELECT * FROM meals 
    WHERE category = ${category}
    ORDER BY created_at DESC
    LIMIT 20
  `;
  return rows;
}

export async function getPopularMeals(limit = 6) {
  const { rows } = await sql`
    SELECT * FROM meals 
    ORDER BY views DESC 
    LIMIT ${limit}
  `;
  return rows;
}

export async function getRecentMeals(limit = 6) {
  const { rows } = await sql`
    SELECT * FROM meals 
    ORDER BY created_at DESC 
    LIMIT ${limit}
  `;
  return rows;
}
