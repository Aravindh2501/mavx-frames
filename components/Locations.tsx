import Link from 'next/link'
import { CITIES, cityPath } from '@/lib/seo'
export default function Locations() {
  return <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-6 md:px-10 md:pb-24">
    <h2 className="font-serif text-3xl md:text-4xl">Two home bases. Stories across Tamil Nadu.</h2>
    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mute">Find us in Chennai and Coimbatore. Planning a shoot elsewhere in Tamil Nadu? Send us your date and location. We also welcome enquiries for Pondicherry.</p>
    <nav aria-label="Photography service areas" className="mt-7"><ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">{CITIES.map(c => <li key={c.slug}><Link className="hover:text-accent" href={cityPath(c.slug)}>{c.name.split(' (')[0]}</Link></li>)}</ul></nav>
  </section>
}
