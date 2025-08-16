import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taskifyes.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/signin', '/signup'],
      disallow: ['/dashboard', '/today-tasks', '/api/', '/_next/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
