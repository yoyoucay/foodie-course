import Link from 'next/link';
import Image from 'next/image';
import logoImg from '@/assets/logo.png';
import classes from './main-header.module.css';
import NavLink from './nav-link';

export default function MainHeader() {
  return (
    <header className={classes.header}>
      <Link className={classes.logo} href="/" aria-label="Foodie homepage">
        <Image src={logoImg} alt="" priority width={36} height={36} />
        Foodie
      </Link>
      <nav className={classes.nav} aria-label="Main navigation">
        <ul>
          <li>
            <NavLink href="/meals">Browse meals</NavLink>
          </li>
          <li>
            <NavLink href="/favorites">Favorites</NavLink>
          </li>
          <li>
            <NavLink href="/community">Community</NavLink>
          </li>
        </ul>
      </nav>
      <Link href="/meals/share" className={classes.cta}>
        Share a recipe
      </Link>
    </header>
  );
}
