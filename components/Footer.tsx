'use client'

import Link from 'next/link'
import { useUI } from './UIProvider'
import { ArrowUpRight, InstagramIcon, MailIcon, YoutubeIcon } from './Icons'
import { site } from '@/lib/site'

export default function Footer({ variant = 'home' }: { variant?: 'home' | 'simple' }) {
  const { href, openContact } = useUI()

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-8 md:gap-14">
          <Link href={href('/')} className="font-serif text-xl">
            {site.name}
          </Link>
          <nav className="flex items-center gap-6 text-sm text-mute">
            <Link href={href('/work')} className="transition-colors hover:text-ink">
              Work
            </Link>
            <Link href={href('/', 'about')} className="transition-colors hover:text-ink">
              About
            </Link>
            <button onClick={openContact} className="transition-colors hover:text-ink">
              Let’s talk
            </button>
          </nav>
        </div>

        {variant === 'home' ? (
          <div className="flex flex-col items-start gap-3 md:items-end">
            <span className="text-xs text-mute">Have a story?</span>
            <button
              onClick={openContact}
              className="flex items-center gap-2 font-serif text-xl italic text-accent"
            >
              Let’s make it unforgettable <ArrowUpRight width={16} height={16} />
            </button>
            <button onClick={openContact} className="btn-solid">
              Start a conversation
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-5 text-ink">
            <a href={site.instagram} aria-label="Instagram" className="hover:text-accent">
              <InstagramIcon />
            </a>
            <a href={site.youtube} aria-label="YouTube" className="hover:text-accent">
              <YoutubeIcon />
            </a>
            <a href={site.email} aria-label="Email" className="hover:text-accent">
              <MailIcon />
            </a>
          </div>
        )}
      </div>
    </footer>
  )
}
