'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFavorites } from '@/lib/hooks/use-favorites';
import MealsGrid from '@/components/meals/meals-grid';
import classes from '@/app/favorites/page.module.css';

export default function FavoritesView() {
  const { favorites, hydrated } = useFavorites();
  const [meals, setMeals] = useState([]);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!hydrated) return;

    if (favorites.length === 0) {
      setMeals([]);
      setStatus('done');
      return;
    }

    setStatus('loading');
    const controller = new AbortController();

    fetch(`/api/meals?slugs=${encodeURIComponent(favorites.join(','))}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then((data) => {
        setMeals(data.meals || []);
        setStatus('done');
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setStatus('error');
      });

    return () => controller.abort();
  }, [hydrated, favorites]);

  return (
    <>
      <header className={classes.header}>
        <h1>
          Your <span className={classes.highlight}>saved recipes</span>
        </h1>
        <p>Bookmarks are stored in this browser, no account required.</p>
      </header>

      <main className={classes.main}>
        {!hydrated || status === 'loading' ? (
          <p className={classes.state}>Loading your favorites...</p>
        ) : status === 'error' ? (
          <p className={classes.state}>Couldn&apos;t load your favorites. Try refreshing.</p>
        ) : meals.length === 0 ? (
          <div className={classes.empty}>
            <p>You haven&apos;t saved any recipes yet.</p>
            <Link href="/meals">Browse meals →</Link>
          </div>
        ) : (
          <MealsGrid meals={meals} />
        )}
      </main>
    </>
  );
}
