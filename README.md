# Foodie Course - Next.js Recipe Sharing Platform

A modern recipe sharing web application built with Next.js 14, featuring advanced meal management, filtering, and user-generated content.

##  Features

- **Recipe Browsing**: Explore a wide variety of meals with advanced filtering
- **Search & Filter**: Find meals by category, difficulty, ingredients, or keywords
- **Share Recipes**: Community members can contribute their own recipes
- **Enhanced Database**: Extended meal metadata including prep time, cook time, servings, and ratings
- **Responsive Design**: Optimized for all devices
- **Image Slideshow**: Beautiful image presentations on the homepage
- **Performance Optimized**: Built with Lighthouse CI integration

##  Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- PostgreSQL database (Vercel Postgres recommended)
- AWS S3 bucket for image storage

##  Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd foodie-course
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

Create a .env.local file in the root directory with the following:
```env
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
POSTGRES_USER=your_db_user
POSTGRES_HOST=your_db_host
POSTGRES_PASSWORD=your_db_password
POSTGRES_DATABASE=your_db_name

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-southeast-2
AWS_S3_BUCKET=your_bucket_name
```

4. Initialize the database:
```bash
node initdb.js
```

5. Enhance the database with extended features:
```bash
node enhance-db.js
```

##  Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
npm run build
npm start
```

##  Project Structure

```
foodie-course/
 app/                          # Next.js App Router pages
    page.js                   # Homepage
    layout.js                 # Root layout
    community/                # Community page
    meals/                    # Meals listing and details
       [mealSlug]/          # Dynamic meal detail pages
       share/               # Share new meal form
 components/                   # React components
    images/                   # Image slideshow
    main-header/             # Navigation header
    meals/                    # Meal-related components
    meals-filter/            # Advanced filtering UI
 lib/                          # Core business logic
    meals.js                  # Meal data operations
    actions.js                # Server actions
 public/                       # Static assets
 enhance-db.js                 # Database enhancement script
 initdb.js                     # Database initialization script
 package.json                  # Dependencies
```

##  Database Schema

### Meals Table
- id - Primary key
- slug - URL-friendly identifier
- 	itle - Meal name
- image - S3 image URL
- summary - Short description
- instructions - Cooking steps
- creator - Author name
- creator_email - Author email
- prep_time - Preparation time (minutes)
- cook_time - Cooking time (minutes)
- servings - Number of servings
- difficulty - easy | medium | hard
- category - Meal category
- ingredients - Ingredients list
- 	ags - Searchable tags
- iews - View count
- ating_sum - Sum of ratings
- ating_count - Number of ratings
- created_at - Creation timestamp

### Categories Table
- id - Primary key
- 
ame - Category name
- slug - URL-friendly identifier
- description - Category description
- icon - Icon identifier

##  Available Scripts

| Script | Description |
|--------|-------------|
| 
pm run dev | Start development server |
| 
pm run build | Create production build |
| 
pm start | Start production server |
| 
pm run lint | Run ESLint |
| 
pm run lighthouse | Run Lighthouse CI |
| 
pm run lighthouse:local | Run Lighthouse on local server |
| 
pm run analyze | Analyze bundle size |

##  Key Features

### Meal Filtering
Filter meals by:
- **Search**: Title, summary, or ingredients
- **Category**: Breakfast, lunch, dinner, desserts, etc.
- **Difficulty**: Easy, medium, or hard
- **Sorting**: By date, title, views, or rating

### Meal Sharing
Users can contribute recipes with:
- Title and description
- Step-by-step instructions
- Ingredient list
- Preparation and cooking times
- Difficulty level and servings
- Image upload (stored in S3)
- Category and tags

### Security Features
- XSS protection for user-generated content
- Email validation
- Form data sanitization
- Input validation on server actions

##  Security

The application implements several security measures:
- Server-side validation for all user inputs
- XSS protection using the xss library
- Slugify for safe URL generation
- Email format validation
- SQL injection protection via parameterized queries

##  Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy

For detailed deployment instructions, check the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

##  Dependencies

### Core Dependencies
- **Next.js 14.0.3** - React framework
- **React 18** - UI library
- **@vercel/postgres** - PostgreSQL client
- **@aws-sdk/client-s3** - AWS S3 integration
- **slugify** - URL-safe slug generation
- **xss** - XSS protection
- **react-hot-toast** - Toast notifications

### Dev Dependencies
- **ESLint** - Code linting
- **Lighthouse CI** - Performance monitoring
- **dotenv** - Environment variable management

##  Performance Monitoring

The project includes Lighthouse CI for performance monitoring:

```bash
# Run Lighthouse CI
npm run lighthouse

# Run Lighthouse locally
npm run lighthouse:local
```

Configuration is in lighthouserc.json.

##  Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) - Database documentation
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/) - Object storage guide

##  Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

##  License

This project is for educational purposes as part of a Next.js course.

##  Acknowledgments

- Next.js team for the amazing framework
- Course instructors and community contributors
