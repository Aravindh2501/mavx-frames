import Hero from '@/components/Hero'
import InFocus from '@/components/InFocus'
import About from '@/components/About'
import Footer from '@/components/Footer'
import Locations from '@/components/Locations'
import { getProjects } from '@/lib/store'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const projects = await getProjects()
  const first = projects[0]
  const images = {
    wide: first?.cover ?? '',
    portrait: (projects[1] ?? first)?.cover ?? '',
    small: (projects[2] ?? first)?.cover ?? ''
  }

  return (
    <main>
      <Hero images={images} />
      <InFocus projects={projects} />
      <About />
      <section aria-label="Our philosophy" className="mx-auto max-w-[1280px] px-6 pb-24 md:px-10 md:pb-36">
        <figure className="portfolio-quote relative isolate overflow-hidden px-8 py-16 text-center md:px-20 md:py-24">
          <blockquote className="relative mx-auto max-w-[20ch] font-serif text-[clamp(2rem,4.5vw,4.5rem)] font-medium leading-[1.15] tracking-[-0.045em]">
            Some moments pass.<br />The feeling stays.
          </blockquote>
          <figcaption className="relative mt-9 text-xs tracking-[0.14em] text-[#F3EAE5]/75">MAVX Frames</figcaption>
        </figure>
      </section>
      <Locations />
      <Footer variant="home" />
    </main>
  )
}
