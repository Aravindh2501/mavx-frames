import { notFound } from 'next/navigation'
import ProjectDetail from '@/components/ProjectDetail'
import JsonLd from '@/components/JsonLd'
import { SITE_URL } from '@/lib/seo'
import { getProject, getProjects } from '@/lib/store'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: 'Not found', robots: { index: false } }
  const where = project.location ? ` in ${project.location}` : ''
  const description =
    project.description ||
    `${project.title}: a ${project.category.toLowerCase()} photography story${where} by MAVX Frames, Chennai.`
  return {
    title: `${project.title} — ${project.category} Photography${where}`,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { type: 'article', title: project.title, description, images: project.cover ? [{ url: project.cover, alt: project.title }] : undefined },
    twitter: { card: 'summary_large_image', title: project.title, description, images: project.cover ? [project.cover] : undefined }
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const projects = await getProjects()
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()
  const project = projects[index]
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null

  return (
    <main>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'ImageGallery',
            name: project.title,
            description: project.description || undefined,
            url: `${SITE_URL}/work/${project.slug}`,
            contentLocation: project.location || undefined,
            image: [project.cover, ...(project.photos || [])].filter(Boolean).slice(0, 12),
            author: { '@id': `${SITE_URL}/#business` }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE_URL}/work` },
              { '@type': 'ListItem', position: 3, name: project.title, item: `${SITE_URL}/work/${project.slug}` }
            ]
          }
        ]}
      />
      <ProjectDetail project={project} next={next} />
    </main>
  )
}
