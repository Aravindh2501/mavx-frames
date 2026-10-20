import Hero from '@/components/Hero'
import InFocus from '@/components/InFocus'
import About from '@/components/About'
import Footer from '@/components/Footer'
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
      <Footer variant="home" />
    </main>
  )
}
