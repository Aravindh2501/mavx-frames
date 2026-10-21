import type { MetadataRoute } from 'next'
import { CITIES, absUrl, cityPath, IS_PREVIEW } from '@/lib/seo'
import { isConcept } from '@/lib/projectSeo'
import { getProjects } from '@/lib/store'
export const dynamic = 'force-dynamic'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (IS_PREVIEW) return []
  const projects = await getProjects()
  return [
    ...['/', '/about', '/work', '/services', '/faq', '/contact'].map(path => ({ url: absUrl(path) })),
    ...CITIES.map(c => ({ url: absUrl(cityPath(c.slug)) })),
    ...projects.filter(p => !isConcept(p)).map(p => ({ url: absUrl(`/work/${p.slug}`), images: Array.from(new Set([p.cover, ...p.photos])).filter(Boolean).map(absUrl) }))
  ]
}
