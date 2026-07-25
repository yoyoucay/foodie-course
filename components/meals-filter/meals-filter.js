'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import classes from './meals-filter.module.css';

const SEARCH_DEBOUNCE_MS = 400;

export default function MealsFilter({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const isFirstRender = useRef(true);

  function pushFilters({ search, category, difficulty }) {
    const params = new URLSearchParams(searchParams);
    if (search) params.set('search', search); else params.delete('search');
    if (category) params.set('category', category); else params.delete('category');
    if (difficulty) params.set('difficulty', difficulty); else params.delete('difficulty');
    params.delete('page'); // any filter change starts back at page 1

    startTransition(() => {
      router.push(`/meals?${params.toString()}`);
    });
  }

  // Debounce free-text search so we don't push a route change per keystroke.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      pushFilters({ search, category, difficulty });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function handleCategoryChange(value) {
    setCategory(value);
    pushFilters({ search, category: value, difficulty });
  }

  function handleDifficultyChange(value) {
    setDifficulty(value);
    pushFilters({ search, category, difficulty: value });
  }

  function clearFilters() {
    setSearch('');
    setCategory('');
    setDifficulty('');
    startTransition(() => {
      router.push('/meals');
    });
  }

  const hasActiveFilters = search || category || difficulty;

  return (
    <div className={classes.filterContainer}>
      <div className={classes.searchBox}>
        <input
          type="search"
          placeholder="Search meals, ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={classes.searchInput}
          aria-label="Search meals or ingredients"
        />
        <span className={classes.status} aria-live="polite">
          {isPending ? 'Searching…' : ''}
        </span>
      </div>

      <div className={classes.filters}>
        <div className={classes.filterGroup}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={classes.select}
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={classes.filterGroup}>
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => handleDifficultyChange(e.target.value)}
            className={classes.select}
          >
            <option value="">All levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button onClick={clearFilters} className={classes.clearButton} disabled={isPending}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
