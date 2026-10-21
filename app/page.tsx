// import StudioContent from '@/components/StudioContent'
import { pageMetadata, BRAND } from '@/lib/seo'
import Hero from '@/components/Hero'
import InFocus from '@/components/InFocus'
import About from '@/components/About'
import Quote from '@/components/Quote'
import Footer from '@/components/Footer'
import Locations from '@/components/Locations'
import { getProjects } from '@/lib/store'

export const metadata = pageMetadata('Photographers in Chennai & Coimbatore', BRAND.description, '/')

export const dynamic = 'force-dynamic'

const HERO_POOL_SIZE = 12

export default async function Home() {
  const projects = await getProjects()
  const pool = Array.from(
    new Set([
      ...projects.map((p) => p.cover),
      ...projects.slice(0, 4).flatMap((p) => p.photos)
    ])
  )
    .filter(Boolean)
    .slice(0, HERO_POOL_SIZE)

  return (
    <main>
      <Hero pool={pool} />
      <InFocus projects={projects} />
      {/* <StudioContent /> */}
      <About />
      <Quote />
      <Locations />
      <Footer variant="home" />
    </main>
  )
}
