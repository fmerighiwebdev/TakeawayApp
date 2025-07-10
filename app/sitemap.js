import { categoryNames } from "@/lib/categories";

export default async function sitemap() {
  const baseUrl = process.env.BASE_URL;
  
  const categories = Object.keys(categoryNames).map(category => ({
    url: `${baseUrl}/${category}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8
  }));

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    {
      url: `${baseUrl}/contatti`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    }
  ];

  return [...staticPages, ...categories];
}