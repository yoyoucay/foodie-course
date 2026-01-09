export default function sitemap() {
  return [
    {
      url: 'https://foodie.beemonswtf.web.id',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://foodie.beemonswtf.web.id/meals',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://foodie.beemonswtf.web.id/community',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://foodie.beemonswtf.web.id/meals/share',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}