import type { MetadataRoute } from 'next'
import { CITIES, SITE_URL, cityPath } from '@/lib/seo'
import { getProjects } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  let projects: Awaited<ReturnType<typeof getProjects>> = []
  try {
    projects = await getProjects()
  } catch {
    projects = []
  }

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/work`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...CITIES.map((c) => ({
      url: `${SITE_URL}${cityPath(c.slug)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: c.slug === 'chennai' || c.slug === 'coimbatore' ? 0.9 : 0.7
    })),
    ...projects.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6
    }))
  ]
}
