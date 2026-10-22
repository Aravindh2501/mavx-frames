import { pageMetadata } from '@/lib/seo'
import { WEDDINGS_ENABLED } from '@/lib/focus'
import { Suspense } from 'react'
import WorkHero from '@/components/WorkHero'
import WorkGallery from '@/components/WorkGallery'
import Footer from '@/components/Footer'
import { getProjects } from '@/lib/store'
import { getImageRatios } from '@/lib/imageSize'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata('Photography Portfolio', WEDDINGS_ENABLED ? 'Explore MAVX Frames portraits, wedding concepts and visual stories. Photography in Chennai and Coimbatore, serving Tamil Nadu.' : 'Explore MAVX Frames portraits, fashion and reel work. Photography in Chennai and Coimbatore, serving Tamil Nadu.', '/work')

export default async function WorkPage() {
  const projects = await getProjects()
  const ratios = await getImageRatios(projects.map((p) => p.cover))

  return (
    <main>
      <WorkHero slides={projects.slice(0, 6)} />
      <header className="mx-auto max-w-[1280px] px-6 pt-16 md:px-10"><h1 className="font-serif text-4xl md:text-5xl">Stories, in frames.</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-mute">Explore our photography and visual direction. AI-generated concepts are labelled separately from photographed projects.</p></header>
      <Suspense fallback={null}>
        <WorkGallery projects={projects} ratios={ratios} />
      </Suspense>
      <Footer variant="home" />
    </main>
  )
}
