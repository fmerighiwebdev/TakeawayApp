import { getTenantCategories, getTenantDetails, getTenantId } from "@/lib/tenantDetails";

export default async function sitemap() {
  const tenantId = await getTenantId();
  const tenantDetails = await getTenantDetails(tenantId);
  const tenantCategories = await getTenantCategories(tenantId);

  const baseUrl = `https://${tenantDetails.domain}`;

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

  const categoryPages = tenantCategories.map(category => ({
    url: `${baseUrl}/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8
  }));

  return [...staticPages, ...categoryPages];
}