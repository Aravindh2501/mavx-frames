import { notFound } from 'next/navigation'
import ProjectDetail from '@/components/ProjectDetail'
import { getProject, getProjects } from '@/lib/store'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)
  return { title: project ? `${project.title} — MAVX Frames` : 'Not found' }
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
      <ProjectDetail project={project} next={next} />
    </main>
  )
}
