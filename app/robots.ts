import { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/qg', '/contact/merci', '/en/thanks', '/espace-client', '/en/dashboard', '/inscription', '/en/signup', '/connexion', '/en/login'] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
