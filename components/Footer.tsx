// components/Footer.tsx
'use client'

import Link from 'next/link'
import { useUI } from './UIProvider'
import { ArrowUpRight, InstagramIcon, MailIcon, YoutubeIcon } from './Icons'
import { site } from '@/lib/site'
import { BRAND } from '@/lib/seo'
import Logo from './Logo'

export default function Footer({
  variant = 'home',
}: {
  variant?: 'home' | 'simple'
}) {
  const { href, openContact } = useUI()

  const navLink = 'inline-flex items-center py-2 transition-colors hover:text-ink'
  const social =
    'inline-flex h-11 w-11 items-center justify-center transition-colors hover:text-accent'

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-5 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10 lg:gap-14">
          <Link
            href={href('/')}
            aria-label={`${BRAND.name} home`}
            className="inline-flex w-[130px] shrink-0 items-center sm:w-[150px] [&_img]:h-auto [&_img]:w-full [&_svg]:h-auto [&_svg]:w-full"
          >
            <Logo width={150} height={49} />
          </Link>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-mute"
          >
            <Link href={href('/work')} className={navLink}>
              Work
            </Link>

            <Link href={href('/about')} className={navLink}>
              About
            </Link>

            <button onClick={openContact} className={navLink}>
              Let’s talk
            </button>
          </nav>
        </div>

        {variant === 'home' ? (
          <div className="flex w-full flex-col items-start gap-3 lg:w-auto lg:items-end">
            <span className="text-xs text-mute">Have a story?</span>

            <button
              onClick={openContact}
              className="flex items-center gap-2 text-left font-serif text-lg italic text-accent sm:text-xl lg:text-right"
            >
              Let’s make it unforgettable
              <ArrowUpRight width={16} height={16} className="shrink-0" />
            </button>

            <button
              onClick={openContact}
              className="btn-solid mt-1 min-h-[44px]"
            >
              Start a conversation
            </button>
          </div>
        ) : (
          <div className="-ml-3 flex items-center gap-1 text-ink lg:ml-0">
            <a href={site.instagram} aria-label="Instagram" className={social}>
              <InstagramIcon />
            </a>

            <a href={site.youtube} aria-label="YouTube" className={social}>
              <YoutubeIcon />
            </a>

            <a href={site.email} aria-label="Email" className={social}>
              <MailIcon />
            </a>
          </div>
        )}
      </div>
    </footer>
  )
}