import { getAllMealSlugs } from '@/lib/meals';
import { SITE_URL } from '@/lib/site';

// D1 access requires a live Workers request context (via getCloudflareContext),
// which isn't available during `next build`'s static generation — force this
// to run per-request instead so it always reflects the current meal list.
export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const staticRoutes = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/meals`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/community`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/meals/share`, changeFrequency: 'monthly', priority: 0.5 },
  ].map((entry) => ({ ...entry, lastModified: new Date() }));

  let mealRoutes = [];
  try {
    const meals = await getAllMealSlugs();
    mealRoutes = meals.map((meal) => ({
      url: `${SITE_URL}/meals/${meal.slug}`,
      lastModified: meal.created_at ? new Date(meal.created_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch {
    // If D1 is unreachable, still serve the static routes rather than fail the whole sitemap.
  }

  return [...staticRoutes, ...mealRoutes];
}
