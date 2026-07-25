-- Sample data for local development / demos.
-- Run with: npm run db:seed:local  (or db:seed:remote against production)
--
-- The `image` column stores an R2 object key. These filenames match
-- assets/*.jpg — run `node scripts/upload-seed-images.mjs` first to push
-- those files into your R2 bucket under the same keys.

INSERT OR IGNORE INTO categories (name, slug, description, icon) VALUES
  ('Breakfast', 'breakfast', 'Start your day right', '🍳'),
  ('Lunch', 'lunch', 'Midday meals', '🥗'),
  ('Dinner', 'dinner', 'Evening delights', '🍽️'),
  ('Desserts', 'desserts', 'Sweet treats', '🍰'),
  ('Snacks', 'snacks', 'Quick bites', '🍿'),
  ('Beverages', 'beverages', 'Drinks and smoothies', '🥤'),
  ('Vegetarian', 'vegetarian', 'Plant-based meals', '🥕'),
  ('Vegan', 'vegan', 'No animal products', '🌱');

INSERT OR IGNORE INTO meals
  (slug, title, image, summary, instructions, creator, creator_email,
   prep_time, cook_time, servings, difficulty, category, ingredients, tags,
   views, rating_sum, rating_count)
VALUES
  (
    'juicy-cheese-burger', 'Juicy Cheese Burger', 'burger.jpg',
    'A mouth-watering burger with a juicy beef patty and melted cheese, served in a soft bun.',
    '1. Mix 200g ground beef with salt and pepper, form into a patty.
2. Heat a pan with oil, cook the patty 2-3 minutes per side until browned.
3. Toast the bun, layer lettuce, tomato, the patty, and a slice of cheese.
4. Top with the other bun half and serve hot.',
    'John Doe', 'johndoe@example.com',
    10, 15, 2, 'easy', 'lunch', 'Ground beef, Cheese, Burger buns, Lettuce, Tomato, Salt, Pepper, Oil', 'quick,classic',
    142, 38, 9
  ),
  (
    'spicy-curry', 'Spicy Curry', 'curry.jpg',
    'A rich and spicy curry, infused with exotic spices and creamy coconut milk.',
    '1. Cut your choice of vegetables into bite-sized pieces.
2. Sauté the vegetables in oil until they start to soften.
3. Stir in 2 tablespoons of curry paste, cook for a minute.
4. Pour in 500ml coconut milk, simmer for 15 minutes.
5. Serve with rice or bread.',
    'Max Schwarz', 'max@example.com',
    15, 30, 4, 'medium', 'dinner', 'Vegetables, Curry paste, Coconut milk, Oil, Rice', 'spicy,vegan-friendly',
    98, 41, 10
  ),
  (
    'homemade-dumplings', 'Homemade Dumplings', 'dumplings.jpg',
    'Tender dumplings filled with savory meat and vegetables, steamed to perfection.',
    '1. Mix minced meat, shredded vegetables, and spices for the filling.
2. Spoon filling into each wrapper, wet the edges, and fold to seal.
3. Arrange dumplings in a steamer and steam for 10 minutes.
4. Serve hot with a dipping sauce of your choice.',
    'Emily Chen', 'emilychen@example.com',
    30, 10, 4, 'hard', 'dinner', 'Minced meat, Dumpling wrappers, Vegetables, Spices, Soy sauce', 'steamed,asian',
    76, 22, 5
  ),
  (
    'classic-mac-n-cheese', 'Classic Mac n Cheese', 'macncheese.jpg',
    'Creamy and cheesy macaroni, a comforting classic that is always a crowd-pleaser.',
    '1. Boil macaroni until al dente.
2. Melt butter, add flour, whisk in milk until thickened, stir in grated cheese.
3. Combine the cheese sauce with the drained macaroni.
4. Transfer to a baking dish, top with breadcrumbs, and bake until golden.
5. Serve hot, garnished with parsley if desired.',
    'Laura Smith', 'laurasmith@example.com',
    10, 25, 4, 'easy', 'lunch', 'Macaroni, Butter, Flour, Milk, Cheese, Breadcrumbs, Parsley', 'comfort-food,budget-friendly',
    203, 55, 12
  ),
  (
    'authentic-pizza', 'Authentic Pizza', 'pizza.jpg',
    'Hand-tossed pizza with a tangy tomato sauce, fresh toppings, and melted cheese.',
    '1. Knead pizza dough and let it rise until doubled in size.
2. Roll out the dough, spread tomato sauce, add toppings and cheese.
3. Bake at 220°C for 15-20 minutes.
4. Slice hot and finish with basil leaves.',
    'Mario Rossi', 'mariorossi@example.com',
    40, 20, 4, 'medium', 'dinner', 'Pizza dough, Tomato sauce, Mozzarella, Basil, Toppings of choice', 'italian,shareable',
    167, 47, 11
  ),
  (
    'wiener-schnitzel', 'Wiener Schnitzel', 'schnitzel.jpg',
    'Crispy, golden-brown breaded veal cutlet, a classic Austrian dish.',
    '1. Pound veal cutlets to an even thickness.
2. Coat each cutlet in flour, dip in beaten egg, then breadcrumbs.
3. Fry in hot oil until golden brown on both sides.
4. Serve hot with lemon and potato salad or greens.',
    'Franz Huber', 'franzhuber@example.com',
    20, 15, 2, 'medium', 'dinner', 'Veal cutlets, Flour, Eggs, Breadcrumbs, Oil, Lemon', 'austrian,fried',
    54, 14, 3
  ),
  (
    'fresh-tomato-salad', 'Fresh Tomato Salad', 'tomato-salad.jpg',
    'A light and refreshing salad with ripe tomatoes, fresh basil, and a tangy vinaigrette.',
    '1. Slice fresh tomatoes and arrange on a plate.
2. Sprinkle chopped basil, salt, and pepper over the tomatoes.
3. Drizzle with olive oil and balsamic vinegar.
4. Serve as a side dish or light meal.',
    'Sophia Green', 'sophiagreen@example.com',
    10, 0, 2, 'easy', 'vegetarian', 'Tomatoes, Basil, Olive oil, Balsamic vinegar, Salt, Pepper', 'light,vegan,no-cook',
    31, 9, 2
  );
