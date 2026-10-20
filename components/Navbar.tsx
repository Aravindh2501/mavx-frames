
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUI } from './UIProvider'
import ThemeToggle from './ThemeToggle'
import { PencilIcon, PlusIcon } from './Icons'
import Logo from './Logo'

export default function Navbar() {
  const { isEdit, href, openContact, openEditor } = useUI()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)

    on()
    window.addEventListener('scroll', on, { passive: true })

    return () => window.removeEventListener('scroll', on)
  }, [])

  // Pages that open with a full-bleed photo behind the navbar
  const overImage =
    (pathname === '/work' || pathname.startsWith('/work/')) && !scrolled

  const link = 'nav-link'

  return (
    <header
      data-scrolled={scrolled}
      data-over-image={overImage}
      className="site-nav fixed inset-x-0 top-0 z-50"
    >
      <div className="site-nav-bar mx-auto flex max-w-[1280px] items-center justify-between gap-2 px-4 md:px-10">
        <Link
          href={href('/')}
          aria-label="MAV X Frames home"
          className="nav-in inline-flex shrink-0 items-center"
          style={{ ['--i' as string]: 0 }}
        >
          <Logo width={150} height={49} priority />
        </Link>

        <nav className="flex items-center gap-2 text-[13px] tracking-[0.02em] sm:gap-7 md:gap-9">
          <Link
            href={href('/work')}
            className={`nav-in ${link}`}
            data-active={pathname.startsWith('/work')}
            style={{ ['--i' as string]: 1 }}
          >
            Work
          </Link>

          <Link
            href={href('/', 'about')}
            className={`nav-in ${link} hidden sm:inline-block`}
            style={{ ['--i' as string]: 2 }}
          >
            About
          </Link>

          <button
            onClick={openContact}
            className="nav-in nav-cta"
            style={{ ['--i' as string]: 3 }}
          >
            Let’s talk
          </button>

          <span className="nav-in" style={{ ['--i' as string]: 4 }}>
            <ThemeToggle />
          </span>

          {isEdit && (
            <span
              className="nav-in flex items-center gap-0 nav-divider pl-1 sm:gap-1 sm:pl-4"
              style={{ ['--i' as string]: 5 }}
            >
              <button
                onClick={() => openEditor(null)}
                title="Add project"
                aria-label="Add project"
                className="nav-icon-btn"
              >
                <PlusIcon width={16} height={16} />
              </button>

              <Link
                href={pathname}
                title="Exit edit mode"
                aria-label="Exit edit mode"
                className="nav-icon-btn"
              >
                <PencilIcon width={15} height={15} />
              </Link>
            </span>
          )}
        </nav>
      </div>
    </header>
  )
}
