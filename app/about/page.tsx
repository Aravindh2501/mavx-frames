// app/about/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import Photo from '@/components/Photo'
import ContactButton from '@/components/ContactButton'
import JsonLd from '@/components/JsonLd'
import { BRAND, SITE_URL } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description: `About ${BRAND.name}, a ${BRAND.base} photographer for weddings, pre-wedding shoots, portraits and events across ${BRAND.region}.`,
  alternates: { canonical: '/about' }
}

export default function AboutPage() {
  return (
    <main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE_URL}/about` }
          ]
        }}
      />

      <article className="mx-auto max-w-[760px] px-5 pb-20 pt-28 sm:px-6 sm:pt-32 md:px-10 md:pb-32 md:pt-44">
        <p className="text-[11px] uppercase tracking-[0.22em] text-mute">About</p>

        <h1 className="mt-4 break-words font-serif text-[clamp(2.1rem,6vw,3.6rem)] leading-[1.1] tracking-[-0.03em] md:mt-5">
          {site.aboutHeading.join(' ')}
        </h1>

        <div className="relative mt-8 aspect-[5/4] w-full overflow-hidden bg-line sm:aspect-[4/3] md:mt-12">
          <Photo
            src={site.aboutImage}
            alt={`${BRAND.name} photographer in ${BRAND.base}`}
            priority
            sizes="(min-width:768px) 680px, 100vw"
            className="object-cover"
          />
        </div>

        <p className="mt-8 text-base leading-[1.8] text-ink/85 md:mt-12 md:text-lg">{site.aboutText}</p>

        <p className="mt-5 text-base leading-[1.8] text-mute md:mt-6">
          Based in {BRAND.base}, travelling for weddings, pre-wedding shoots, portraits and events across{' '}
          {BRAND.region}.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-8 md:mt-12">
          <ContactButton label="Let’s talk" />
          <Link href="/work" className="btn-ghost inline-flex min-h-[44px] items-center">
            See our work
          </Link>
        </div>
      </article>

      <Footer variant="simple" />
    </main>
  )
}