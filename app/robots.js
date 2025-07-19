import { getTenantDetails, getTenantId } from "@/lib/tenantDetails"

export default async function robots() {
    const tenantId = await getTenantId();
    const tenantDetails = await getTenantDetails(tenantId);

    return {
      rules: [{
        userAgent: '*',
        allow: '/',
        disallow: [
          '/carrello',
          '/checkout',
          '/api/*',
          '/admin/*'
        ],
      }],
      sitemap: `https://${tenantDetails.domain}/sitemap.xml`,
    }
  }