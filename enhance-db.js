require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function enhanceDatabase() {
  try {
    console.log(' Starting database enhancement...');

    // Add new columns to meals table
    console.log('Adding new columns to meals table...');
    
    await sql`
      ALTER TABLE meals 
      ADD COLUMN IF NOT EXISTS prep_time INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS cook_time INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS servings INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20) DEFAULT 'medium',
      ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'other',
      ADD COLUMN IF NOT EXISTS ingredients TEXT,
      ADD COLUMN IF NOT EXISTS tags TEXT,
      ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS rating_sum INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `;

    console.log(' Columns added successfully');

    // Create categories table
    console.log('Creating categories table...');
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        slug VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        icon VARCHAR(50)
      )
    `;

    // Insert default categories
    const categories = [
      { name: 'Breakfast', slug: 'breakfast', description: 'Start your day right', icon: '' },
      { name: 'Lunch', slug: 'lunch', description: 'Midday meals', icon: '' },
      { name: 'Dinner', slug: 'dinner', description: 'Evening delights', icon: '' },
      { name: 'Desserts', slug: 'desserts', description: 'Sweet treats', icon: '' },
      { name: 'Snacks', slug: 'snacks', description: 'Quick bites', icon: '' },
      { name: 'Beverages', slug: 'beverages', description: 'Drinks and smoothies', icon: '' },
      { name: 'Vegetarian', slug: 'vegetarian', description: 'Plant-based meals', icon: '' },
      { name: 'Vegan', slug: 'vegan', description: 'No animal products', icon: '' },
    ];

    for (const cat of categories) {
      await sql`
        INSERT INTO categories (name, slug, description, icon)
        VALUES (${cat.name}, ${cat.slug}, ${cat.description}, ${cat.icon})
        ON CONFLICT (slug) DO NOTHING
      `;
    }

    console.log(' Categories created');

    // Update existing meals with sample data
    console.log('Updating existing meals with sample data...');
    const mealsToUpdate = [
      { slug: 'juicy-cheese-burger', prep_time: 10, cook_time: 15, servings: 2, difficulty: 'easy', category: 'lunch', ingredients: 'Ground beef, Cheese, Burger buns, Lettuce, Tomato, Salt, Pepper, Oil' },
      { slug: 'spicy-curry', prep_time: 15, cook_time: 30, servings: 4, difficulty: 'medium', category: 'dinner', ingredients: 'Vegetables, Curry paste, Coconut milk, Oil, Rice' },
      { slug: 'homemade-dumplings', prep_time: 30, cook_time: 10, servings: 4, difficulty: 'hard', category: 'dinner', ingredients: 'Minced meat, Dumpling wrappers, Vegetables, Spices, Soy sauce' },
      { slug: 'classic-mac-n-cheese', prep_time: 10, cook_time: 25, servings: 4, difficulty: 'easy', category: 'lunch', ingredients: 'Macaroni, Butter, Flour, Milk, Cheese, Breadcrumbs, Parsley' },
    ];

    for (const meal of mealsToUpdate) {
      await sql`
        UPDATE meals 
        SET 
          prep_time = ${meal.prep_time},
          cook_time = ${meal.cook_time},
          servings = ${meal.servings},
          difficulty = ${meal.difficulty},
          category = ${meal.category},
          ingredients = ${meal.ingredients}
        WHERE slug = ${meal.slug}
      `;
    }

    console.log(' Existing meals updated');
    console.log(' Database enhancement complete!');
    
  } catch (error) {
    console.error(' Error enhancing database:', error);
    throw error;
  } finally {
    process.exit();
  }
}

enhanceDatabase();
