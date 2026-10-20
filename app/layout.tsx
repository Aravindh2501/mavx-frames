import { Suspense } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import UIProvider from '@/components/UIProvider'
import Navbar from '@/components/Navbar'
import SmoothScroll from '@/components/SmoothScroll'
import JsonLd from '@/components/JsonLd'
import { BRAND, CITIES, SITE_URL, cityPath } from '@/lib/seo'
import { site } from '@/lib/site'

const TITLE = 'MAVX Frames — Wedding & Pre-Wedding Photographer in Chennai, Tamil Nadu'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: '%s | MAVX Frames' },
  description: BRAND.description,
  applicationName: BRAND.name,
  keywords: [
    'wedding photographer in Chennai',
    'pre wedding photographer Chennai',
    'candid wedding photography Tamil Nadu',
    'wedding photographer Coimbatore',
    'wedding photographer Madurai',
    'wedding photographer Trichy',
    'wedding photographer Thanjavur',
    'wedding photographer Pondicherry',
    'wedding photographer Vellore',
    'wedding photographer Cuddalore',
    'photographer Chennai'
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: BRAND.name,
    title: TITLE,
    description: BRAND.description,
    images: [{ url: BRAND.ogImage, alt: 'MAVX Frames wedding photography in Chennai' }]
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: BRAND.description, images: [BRAND.ogImage] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  other: {
    'geo.region': 'IN-TN',
    'geo.placename': 'Chennai',
    'geo.position': `${BRAND.geo.lat};${BRAND.geo.lng}`,
    ICBM: `${BRAND.geo.lat}, ${BRAND.geo.lng}`
  }
}

const businessJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': `${SITE_URL}/#business`,
    name: BRAND.name,
    url: SITE_URL,
    description: BRAND.description,
    image: `${SITE_URL}${BRAND.ogImage}`,
    priceRange: '₹₹',
    address: { '@type': 'PostalAddress', addressLocality: 'Chennai', addressRegion: 'Tamil Nadu', addressCountry: 'IN' },
    geo: { '@type': 'GeoCoordinates', latitude: BRAND.geo.lat, longitude: BRAND.geo.lng },
    areaServed: CITIES.map((c) => ({ '@type': 'City', name: c.name.split(' (')[0], url: `${SITE_URL}${cityPath(c.slug)}` })),
    knowsAbout: ['Wedding photography', 'Pre-wedding photography', 'Portrait photography', 'Event photography'],
    sameAs: [site.instagram, site.youtube].filter(Boolean)
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BRAND.name,
    inLanguage: 'en-IN',
    publisher: { '@id': `${SITE_URL}/#business` }
  }
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()"
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <JsonLd data={businessJsonLd} />
        <Suspense fallback={null}>
          <UIProvider>
            <SmoothScroll />
            <Navbar />
            {children}
          </UIProvider>
        </Suspense>
      </body>
    </html>
  )
}
