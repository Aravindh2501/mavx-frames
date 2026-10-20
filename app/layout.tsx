import { Suspense } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import UIProvider from '@/components/UIProvider'
import Navbar from '@/components/Navbar'
import SmoothScroll from '@/components/SmoothScroll'

export const metadata: Metadata = {
  title: 'MAVX Frames — Wedding photography in Chennai',
  description: 'Weddings, people and the quiet moments that make them unforgettable.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Newsreader:ital,opsz,wght@0,6..72,300..500;1,6..72,300..500&display=swap"
        />
      </head>
      <body>
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
