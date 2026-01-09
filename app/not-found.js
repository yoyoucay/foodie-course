export const metadata = {
  title: 'Page Not Found | Foodie',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Not Found</h1>
      <p>Unfortunately, we could not find the requested page or resource.</p>
      <p>
        <a href="/">Go back home</a>
      </p>
    </main>
  );
}