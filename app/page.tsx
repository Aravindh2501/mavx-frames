// app/page.tsx
import Hero from '@/components/Hero'
import InFocus from '@/components/InFocus'
import About from '@/components/About'
import Footer from '@/components/Footer'
import Locations from '@/components/Locations'
import { getProjects } from '@/lib/store'
import { BRAND } from '@/lib/seo'

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
      <section aria-label="Our philosophy" className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-6 md:px-10 md:pb-36">
        <figure className="portfolio-quote relative isolate overflow-hidden px-6 py-14 text-center sm:px-8 sm:py-16 md:px-20 md:py-24">
          <blockquote className="relative mx-auto max-w-[20ch] font-serif text-[clamp(1.75rem,4.5vw,4.5rem)] font-medium leading-[1.15] tracking-[-0.045em]">
            Some moments pass.<br />The feeling stays.
          </blockquote>
          <figcaption className="relative mt-8 text-xs tracking-[0.14em] text-[#F3EAE5]/75 md:mt-9">{BRAND.name}</figcaption>
        </figure>
      </section>
      <Locations />
      <Footer variant="home" />
    </main>
  )
}