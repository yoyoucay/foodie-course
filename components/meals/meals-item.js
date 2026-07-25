import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/storage';
import StarRating from './star-rating';
import FavoriteButton from './favorite-button';
import classes from './meal-item.module.css';

export default function MealItem({ title, slug, image, summary, creator, rating_sum, rating_count }) {
  return (
    <article className={classes.meal}>
      <Link href={`/meals/${slug}`} className={classes.imageLink}>
        <div className={classes.image}>
          <Image
            src={getImageUrl(image)}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
            loading="lazy"
          />
        </div>
      </Link>
      <div className={classes.body}>
        <div className={classes.headerRow}>
          <h2>
            <Link href={`/meals/${slug}`}>{title}</Link>
          </h2>
          <FavoriteButton slug={slug} title={title} />
        </div>
        <p className={classes.creator}>by {creator}</p>
        <StarRating ratingSum={rating_sum} ratingCount={rating_count} size="sm" />
        <p className={classes.summary}>{summary}</p>
        <div className={classes.actions}>
          <Link href={`/meals/${slug}`} className={classes.link}>
            View recipe →
          </Link>
        </div>
      </div>
    </article>
  );
}
