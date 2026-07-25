import Image from 'next/image';
import mealIcon from '@/assets/icons/meal.png';
import communityIcon from '@/assets/icons/community.png';
import eventsIcon from '@/assets/icons/events.png';
import classes from './page.module.css';

export const metadata = {
  title: 'Foodies Community - Foodie',
  description: 'Join our community of food lovers. Share recipes, find new friends, and participate in exclusive cooking events.',
  alternates: { canonical: '/community' },
};

const PERKS = [
  { icon: mealIcon, alt: 'A plated meal', text: 'Share and discover recipes' },
  { icon: communityIcon, alt: 'A group of people cooking together', text: 'Meet like-minded home cooks' },
  { icon: eventsIcon, alt: 'A crowd at a cooking event', text: 'Join exclusive cooking events' },
];

export default function CommunityPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          One shared passion: <span className={classes.highlight}>food</span>
        </h1>
        <p>Join a community built around good recipes and better company.</p>
      </header>
      <main className={classes.main}>
        <h2>What you get</h2>
        <ul className={classes.perks}>
          {PERKS.map((perk) => (
            <li key={perk.text}>
              <Image src={perk.icon} alt={perk.alt} width={72} height={72} />
              <p>{perk.text}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
