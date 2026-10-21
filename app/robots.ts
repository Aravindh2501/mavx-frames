import type { MetadataRoute } from 'next'
import { SITE_URL, IS_PREVIEW } from '@/lib/seo'
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }], ...(IS_PREVIEW ? {} : { sitemap: `${SITE_URL}/sitemap.xml` }) }
}
