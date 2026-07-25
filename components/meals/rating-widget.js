'use client';

import { useEffect, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { rateMeal } from '@/lib/actions';
import classes from './rating-widget.module.css';

export default function RatingWidget({ slug }) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setAlreadyRated(document.cookie.includes(`rated_${slug}=`));
  }, [slug]);

  function submitRating(rating) {
    setSelected(rating);
    startTransition(async () => {
      const result = await rateMeal(slug, rating);
      if (result.success) {
        toast.success(result.message);
        setAlreadyRated(true);
      } else {
        toast.error(result.message);
      }
    });
  }

  if (alreadyRated) {
    return <p className={classes.thanks}>Thanks — you&apos;ve already rated this recipe.</p>;
  }

  return (
    <div className={classes.widget}>
      <p className={classes.prompt}>Rate this recipe</p>
      <div
        className={classes.starRow}
        role="radiogroup"
        aria-label="Rate this recipe from 1 to 5 stars"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={selected === n}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            disabled={isPending}
            className={n <= (hovered || selected) ? classes.filled : classes.empty}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onFocus={() => setHovered(n)}
            onBlur={() => setHovered(0)}
            onClick={() => submitRating(n)}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}
