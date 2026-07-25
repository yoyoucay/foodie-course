import Link from 'next/link';
import classes from './pagination.module.css';

function buildHref(basePath, searchParams, page) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams || {})) {
    if (key === 'page') continue;
    if (typeof value === 'string' && value) params.set(key, value);
  }
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function getPageWindow(current, total) {
  const windowSize = 1;
  const pages = new Set([1, total, current]);
  for (let i = current - windowSize; i <= current + windowSize; i++) {
    if (i > 0 && i <= total) pages.add(i);
  }
  return [...pages].sort((a, b) => a - b);
}

export default function Pagination({ currentPage, totalPages, basePath = '/meals', searchParams }) {
  if (totalPages <= 1) return null;

  const pages = getPageWindow(currentPage, totalPages);

  return (
    <nav className={classes.pagination} aria-label="Meals pagination">
      <Link
        href={buildHref(basePath, searchParams, Math.max(1, currentPage - 1))}
        className={classes.step}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
      >
        ← Prev
      </Link>

      <ul className={classes.pages}>
        {pages.map((page, index) => {
          const prevPage = pages[index - 1];
          const showGap = prevPage !== undefined && page - prevPage > 1;
          return (
            <li key={page} className={classes.pageItem}>
              {showGap && <span className={classes.gap}>…</span>}
              <Link
                href={buildHref(basePath, searchParams, page)}
                className={page === currentPage ? `${classes.page} ${classes.current}` : classes.page}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href={buildHref(basePath, searchParams, Math.min(totalPages, currentPage + 1))}
        className={classes.step}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
      >
        Next →
      </Link>
    </nav>
  );
}
