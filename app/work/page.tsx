import { Suspense } from 'react'
import WorkHero from '@/components/WorkHero'
import WorkGallery from '@/components/WorkGallery'
import Footer from '@/components/Footer'
import { getProjects } from '@/lib/store'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Work — MAVX Frames' }

export default async function WorkPage() {
  const projects = await getProjects()

  return (
    <main>
      <WorkHero slides={projects.slice(0, 6)} />
      <Suspense fallback={null}>
        <WorkGallery projects={projects} />
      </Suspense>
      <Footer variant="home" />
    </main>
  )
}
