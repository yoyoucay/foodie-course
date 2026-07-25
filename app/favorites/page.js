import FavoritesView from '@/components/meals/favorites-view';

export const metadata = {
  title: 'Your Favorites - Foodie',
  description: 'Recipes you have bookmarked in this browser.',
  // Personalized, client-rendered, and different per visitor's localStorage —
  // not meaningful content to index.
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return <FavoritesView />;
}
