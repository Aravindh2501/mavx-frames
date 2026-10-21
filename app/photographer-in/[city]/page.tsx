import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import ContactButton from '@/components/ContactButton'
import {
  BRAND,
  CITIES,
  SITE_URL,
  cityDescription,
  cityPath,
  cityTitle,
  getCity
} from '@/lib/seo'

export const dynamicParams = false

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }))
}

type Props = { params: Promise<{ city: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const c = getCity(city)
  if (!c) return { title: 'Not found', robots: { index: false } }
  const title = cityTitle(c)
  const description = cityDescription(c)
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: cityPath(c.slug) },
    openGraph: { type: 'website', title, description, url: cityPath(c.slug), images: [{ url: BRAND.ogImage }] },
    twitter: { card: 'summary_large_image', title, description, images: [BRAND.ogImage] }
  }
}

export default async function CityPage({ params }: Props) {
  const { city } = await params
  const c = getCity(city)
  if (!c) notFound()

  const short = c.name.split(' (')[0]
  const url = `${SITE_URL}${cityPath(c.slug)}`
  const nearby = CITIES.filter((x) => x.slug !== c.slug)
    .sort((a, b) => Math.abs(a.hours - c.hours) - Math.abs(b.hours - c.hours))
    .slice(0, 6)

  const faqs = [
    {
      q: `Do you photograph weddings in ${short}?`,
      a:
        ['chennai', 'coimbatore'].includes(c.slug)
          ? `Yes. ${short} is one of our home bases. We cover weddings, receptions, engagements and pre-wedding shoots across the city.`
          : `Yes. Based in Chennai and Coimbatore, we travel to ${short} for weddings, engagements, pre-wedding shoots and portraits.`
    },
    {
      q: `How do we choose a pre-wedding location in ${short}?`,
      a: `Ideas to discuss include ${c.spots
        .slice(0, 3)
        .map((s) => s.name)
        .join(', ')}. The final choice depends on access, permissions, light and your plans. A listed place is not a confirmed shoot location.`
    },
    {
      q: `How do I book a photographer for ${short}?`,
      a: `Send us your date, venue and the type of shoot using the enquiry form. We will reply with availability, travel details and a quote.`
    }
  ]

  return (
    <main>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': `${url}#service`,
            name: `${BRAND.name} — Photographer in ${short}`,
            url,
            description: cityDescription(c),
            provider: { '@id': `${SITE_URL}/#business` },
            areaServed: { '@type': 'City', name: short },
            serviceType: c.shoots
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: `Photographer in ${short}`, item: url }
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a }
            }))
          }
        ]}
      />

      <article className="mx-auto max-w-[1000px] px-6 pb-24 pt-32 md:px-10 md:pt-40">
        <h1 className="font-serif text-[clamp(2.4rem,6vw,4.8rem)] leading-[1.05] tracking-[-0.04em]">
          Wedding &amp; pre-wedding photographer in <span className="italic text-accent">{short}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/80 md:text-lg">{c.intro}</p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mute">Based in Chennai and Coimbatore, serving all of Tamil Nadu. Share your venue and date to discuss availability, coverage and travel.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <ContactButton label={`Book a shoot in ${short}`} />
          <Link href="/work" className="btn-ghost">
            See our work
          </Link>
        </div>

        <section className="mt-20" aria-labelledby="spots">
          <h2 id="spots" className="font-serif text-3xl tracking-tight md:text-4xl">
            Planning your shoot in {short}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-mute">These are setting ideas to discuss. Temple, heritage-site, private-property and commercial photography rules vary. Confirm current access, permissions and fees before making plans.</p>
          <ul className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {c.spots.map((s) => (
              <li key={s.name} className="border-t border-line pt-4">
                <h3 className="font-serif text-xl">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{s.note}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20" aria-labelledby="shoots">
          <h2 id="shoots" className="font-serif text-3xl tracking-tight md:text-4xl">
            What we shoot in {short}
          </h2>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-base text-ink/80">
            {c.shoots.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <section className="mt-20" aria-labelledby="faq">
          <h2 id="faq" className="font-serif text-3xl tracking-tight md:text-4xl">
            Questions about photography in {short}
          </h2>
          <dl className="mt-8 space-y-7">
            {faqs.map((f) => (
              <div key={f.q} className="border-t border-line pt-4">
                <dt className="font-serif text-xl">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-mute">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav className="mt-20" aria-label="Other cities">
          <h2 className="font-serif text-2xl tracking-tight">We also photograph in</h2>
          <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-3 text-sm">
            {nearby.map((n) => (
              <li key={n.slug}>
                <Link href={cityPath(n.slug)} className="text-ink/80 transition-colors hover:text-accent">
                  Photographer in {n.name.split(' (')[0]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </article>

      <Footer variant="home" />
    </main>
  )
}
