import MainHeader from '../components/main-header/main-header';
import './globals.css';

export const metadata = {
  title: 'Foodie - Share & Discover Amazing Recipes',
  description: 'Join our food-loving community to share your favorite recipes and discover delicious meals from around the world. Browse thousands of recipes and connect with fellow foodies.',
  keywords: 'recipes, food, cooking, meals, community, share recipes',
  authors: [{ name: 'Foodie' }],
  metadataBase: new URL('https://foodie.beemonswtf.web.id'),
  openGraph: {
    title: 'Foodie - Share & Discover Amazing Recipes',
    description: 'Join our food-loving community to share your favorite recipes and discover delicious meals.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foodie - Share & Discover Amazing Recipes',
    description: 'Join our food-loving community to share your favorite recipes.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://foodie-course-image.s3.ap-southeast-2.amazonaws.com" />
      </head>
      <body>
        <MainHeader />
        {children}
      </body>
    </html>
  );
}