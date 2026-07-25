'use client';

import { useFavorites } from '@/lib/hooks/use-favorites';
import classes from './favorite-button.module.css';

export default function FavoriteButton({ slug, title }) {
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();
  const active = hydrated && isFavorite(slug);

  return (
    <button
      type="button"
      className={`${classes.button} ${active ? classes.active : ''}`}
      aria-pressed={active}
      aria-label={active ? `Remove ${title} from favorites` : `Save ${title} to favorites`}
      onClick={(event) => {
        event.preventDefault();
        toggleFavorite(slug);
      }}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          d="M12 20.3 4.6 13c-2.1-2.1-2.1-5.5 0-7.6 2.1-2.1 5.4-2.1 7.4.2 2-2.3 5.3-2.3 7.4-.2 2.1 2.1 2.1 5.5 0 7.6L12 20.3Z"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
