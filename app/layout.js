import { Fraunces, Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import MainHeader from '../components/main-header/main-header';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'Foodie - Share & Discover Amazing Recipes',
  description: 'Join our food-loving community to share your favorite recipes and discover delicious meals from around the world. Browse thousands of recipes and connect with fellow foodies.',
  keywords: 'recipes, food, cooking, meals, community, share recipes',
  authors: [{ name: 'Foodie' }],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'Foodie - Share & Discover Amazing Recipes',
    description: 'Join our food-loving community to share your favorite recipes and discover delicious meals.',
    url: SITE_URL,
    siteName: 'Foodie',
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
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#b5482b',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <MainHeader />
        {children}
        <Toaster position="bottom-center" toastOptions={{ duration: 3500 }} />
      </body>
    </html>
  );
}
