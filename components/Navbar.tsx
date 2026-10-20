// components/Navbar.tsx
'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUI } from './UIProvider'
import ThemeToggle from './ThemeToggle'
import { PencilIcon, PlusIcon } from './Icons'
import Logo from './Logo'
import { BRAND } from '@/lib/seo'

export default function Navbar() {
  const { isEdit, href, openContact, openEditor } = useUI()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)

    on()
    window.addEventListener('scroll', on, { passive: true })

    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false)
    }
    const previous = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onChange)

    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onChange)
    }
  }, [open])

  const overImage =
    (pathname === '/work' || pathname.startsWith('/work/')) && !scrolled && !open

  const link = 'nav-link'
  const workActive = pathname.startsWith('/work')
  const aboutActive = pathname === '/about'

  const sheetLink =
    'block border-b border-line py-4 font-serif text-2xl transition-colors hover:text-accent'

  return (
    <>
      {open && (
        <div
          aria-hidden="true"
          onClick={close}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <header
        data-scrolled={scrolled}
        data-over-image={overImage}
        className={`site-nav fixed inset-x-0 top-0 z-50 ${open ? 'bg-paper' : ''}`}
      >
        <div className="site-nav-bar mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6 md:px-10">
          <Link
            href={href('/')}
            aria-label={`${BRAND.name} home`}
            className="nav-in inline-flex w-[112px] shrink-0 items-center min-[400px]:w-[130px] sm:w-[150px] [&_img]:h-auto [&_img]:w-full [&_svg]:h-auto [&_svg]:w-full"
            style={{ ['--i' as string]: 0 }}
          >
            <Logo width={150} height={49} priority />
          </Link>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-9">
            <nav
              aria-label="Primary"
              className="hidden items-center gap-9 text-[13px] tracking-[0.02em] md:flex"
            >
              <Link
                href={href('/work')}
                className={`nav-in ${link}`}
                data-active={workActive}
                style={{ ['--i' as string]: 1 }}
              >
                Work
              </Link>

              <Link
                href={href('/about')}
                className={`nav-in ${link}`}
                data-active={aboutActive}
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
            </nav>

            <span className="nav-in" style={{ ['--i' as string]: 4 }}>
              <ThemeToggle />
            </span>

            {isEdit && (
              <span
                className="nav-in nav-divider hidden items-center gap-1 pl-4 md:flex"
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

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="nav-in inline-flex h-11 w-11 items-center justify-center md:hidden"
              style={{ ['--i' as string]: 5 }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {open ? (
                  <>
                    <path d="M4 4L18 18" />
                    <path d="M18 4L4 18" />
                  </>
                ) : (
                  <>
                    <path d="M3 6H19" />
                    <path d="M3 11H19" />
                    <path d="M3 16H19" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-full max-h-[80dvh] overflow-y-auto overscroll-contain border-b border-line bg-paper px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-2 sm:px-6 md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              <Link
                href={href('/work')}
                onClick={close}
                aria-current={workActive ? 'page' : undefined}
                className={`${sheetLink} ${workActive ? 'text-accent' : ''}`}
              >
                Work
              </Link>

              <Link
                href={href('/about')}
                onClick={close}
                aria-current={aboutActive ? 'page' : undefined}
                className={`${sheetLink} ${aboutActive ? 'text-accent' : ''}`}
              >
                About
              </Link>

              <button
                onClick={() => {
                  close()
                  openContact()
                }}
                className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center border border-ink text-sm tracking-[0.02em] transition-colors hover:border-accent hover:text-accent"
              >
                Let’s talk
              </button>

              {isEdit && (
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-6 text-sm">
                  <button
                    onClick={() => {
                      close()
                      openEditor(null)
                    }}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 border border-line"
                  >
                    <PlusIcon width={16} height={16} />
                    Add project
                  </button>

                  <Link
                    href={pathname}
                    onClick={close}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 border border-line"
                  >
                    <PencilIcon width={15} height={15} />
                    Exit edit
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}