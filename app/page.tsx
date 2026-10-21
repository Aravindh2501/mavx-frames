import StudioContent from '@/components/StudioContent'
import { pageMetadata, BRAND } from '@/lib/seo'
import Hero from '@/components/Hero'
import InFocus from '@/components/InFocus'
import About from '@/components/About'
import Quote from '@/components/Quote'
import Footer from '@/components/Footer'
import Locations from '@/components/Locations'
import { getProjects } from '@/lib/store'
import { getImageRatios } from '@/lib/imageSize'
import { projectAlt } from '@/lib/projectSeo'

export const metadata = pageMetadata('Photographers in Chennai & Coimbatore', BRAND.description, '/')

export const dynamic = 'force-dynamic'

const HERO_POOL_SIZE = 12

export default async function Home() {
  const projects = await getProjects()
  const entries = [
    ...projects.map((p) => ({ src: p.cover, alt: projectAlt(p) })),
    ...projects.slice(0, 4).flatMap((p) => p.photos.map((src, i) => ({ src, alt: projectAlt(p, i + 1) })))
  ]
  const seen = new Set<string>()
  const pool = entries
    .filter((e) => e.src && !seen.has(e.src) && seen.add(e.src))
    .slice(0, HERO_POOL_SIZE)
  const ratios = await getImageRatios([...pool.map((e) => e.src), ...projects.map((p) => p.cover)])

  return (
    <main>
      <Hero pool={pool} ratios={ratios} />
      <InFocus projects={projects} ratios={ratios} />
      <StudioContent />
      <About />
      <Quote />
      <Locations />
      <Footer variant="home" />
    </main>
  )
}
