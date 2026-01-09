export const metadata = {
  title: 'Meal Not Found | Foodie',
  description: 'The meal you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Meal Not Found</h1>
      <p>Unfortunately, we could not find the requested meal.</p>
      <p>
        <a href="/meals">Browse all meals</a>
      </p>
    </main>
  );
}