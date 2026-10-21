import { Suspense } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import UIProvider from '@/components/UIProvider'
import Navbar from '@/components/Navbar'
import SmoothScroll from '@/components/SmoothScroll'
import JsonLd from '@/components/JsonLd'
import { BRAND, SITE_URL, IS_PREVIEW, absUrl } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${BRAND.name} | Photography in Chennai & Coimbatore`, template: `%s | ${BRAND.name}` },
  description: BRAND.description,
  applicationName: BRAND.name,
  icons: { icon: BRAND.logo, apple: BRAND.logo },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined, other: process.env.BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } : undefined },
  robots: { index: !IS_PREVIEW, follow: true, googleBot: { index: !IS_PREVIEW, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } }
}

const businessJsonLd = [
  {
    '@context': 'https://schema.org', '@type': 'Organization',
    '@id': `${SITE_URL}/#business`, name: BRAND.name, url: SITE_URL,
    description: BRAND.description, logo: absUrl(BRAND.logo),
    founder: { '@type': 'Person', name: 'Aravindh' },
    location: ['Chennai', 'Coimbatore'].map(name => ({ '@type': 'City', name })),
    areaServed: [{ '@type': 'State', name: 'Tamil Nadu' }, { '@type': 'City', name: 'Puducherry' }],
    email: site.email ? site.email.replace('mailto:', '') : undefined,
    telephone: site.phone || undefined,
    sameAs: [site.instagram, site.youtube].filter(Boolean)
  },
  {
    '@context': 'https://schema.org', '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`, url: SITE_URL, name: BRAND.name,
    inLanguage: 'en-IN', publisher: { '@id': `${SITE_URL}/#business` }
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
