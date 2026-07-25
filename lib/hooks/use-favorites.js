'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'foodie:favorites';

function readFavorites() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeFavorites(slugs) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
}

// Bookmarks live entirely in the browser: no accounts, no server round trip.
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavorites(readFavorites());
    setHydrated(true);

    function onStorage(event) {
      if (event.key === STORAGE_KEY) setFavorites(readFavorites());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleFavorite = useCallback((slug) => {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      writeFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((slug) => favorites.includes(slug), [favorites]);

  return { favorites, hydrated, toggleFavorite, isFavorite };
}
