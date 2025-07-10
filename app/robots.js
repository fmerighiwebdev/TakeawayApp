export default function robots() {
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
      sitemap: `${process.env.BASE_URL}/sitemap.xml`,
    }
  }