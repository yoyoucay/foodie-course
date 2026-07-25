import classes from './star-rating.module.css';

export default function StarRating({ ratingSum = 0, ratingCount = 0, size = 'md' }) {
  const average = ratingCount > 0 ? ratingSum / ratingCount : 0;
  const filledStars = Math.round(average);

  const label =
    ratingCount > 0
      ? `Rated ${average.toFixed(1)} out of 5 from ${ratingCount} review${ratingCount === 1 ? '' : 's'}`
      : 'Not yet rated';

  return (
    <div className={`${classes.stars} ${classes[size] || ''}`} aria-label={label}>
      <span className={classes.icons} aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={n <= filledStars ? classes.filled : classes.empty}>
            ★
          </span>
        ))}
      </span>
      <span className={classes.count}>
        {ratingCount > 0 ? `${average.toFixed(1)} (${ratingCount})` : 'No reviews yet'}
      </span>
    </div>
  );
}
