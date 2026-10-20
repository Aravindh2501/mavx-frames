'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useUI } from './UIProvider'
import ThemeToggle from './ThemeToggle'
import { PencilIcon, PlusIcon } from './Icons'
import { site } from '@/lib/site'

gsap.registerPlugin(useGSAP)

export default function Navbar() {
  const { isEdit, href, openContact, openEditor } = useUI()
  const pathname = usePathname()
  const root = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useGSAP(
    () => {
      gsap.from('.nav-item', {
        y: -18,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.2
      })
    },
    { scope: root }
  )

  const overImage = (pathname === '/work' || pathname.startsWith('/work/')) && !scrolled && !isEdit
  const tone = overImage ? 'text-white' : 'text-ink'
  const exit = pathname

  return (
    <>
      {isEdit && (
        <div className="fixed inset-x-0 top-0 z-[60] flex h-7 items-center bg-ink px-6 text-[10px] uppercase tracking-[0.2em] text-paper/90">
          Owner view only · ?edit=true
        </div>
      )}
      <header
        ref={root}
        className={`fixed inset-x-0 z-50 transition-colors duration-500 ${
          isEdit ? 'top-7' : 'top-0'
        } ${scrolled && !isEdit ? 'bg-paper/80 backdrop-blur-md' : ''}`}
      >
        <div
          className={`mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5 md:px-10 ${
            isEdit ? 'rounded-md bg-[#454545] py-3 text-white' : tone
          }`}
        >
          <Link href={href('/')} className="nav-item font-serif text-xl tracking-tight whitespace-nowrap">
            {site.name}
          </Link>
          <nav className="flex items-center gap-5 text-sm md:gap-8">
            <Link href={href('/work')} className="nav-item transition-opacity hover:opacity-60">
              Work
            </Link>
            <Link
              href={href('/', 'about')}
              className="nav-item hidden transition-opacity hover:opacity-60 sm:inline"
            >
              About
            </Link>
            <button
              onClick={openContact}
              className="nav-item flex items-center gap-1.5 transition-opacity hover:opacity-60"
            >
              Let’s talk <span className="text-[8px]">✦</span>
            </button>
            <ThemeToggle />
            {isEdit && (
              <>
                <Link
                  href={exit}
                  title="Leave owner view"
                  className="nav-item opacity-80 transition-opacity hover:opacity-100"
                >
                  <PencilIcon width={16} height={16} />
                </Link>
                <button
                  onClick={() => openEditor(null)}
                  title="Add project"
                  className="nav-item flex h-8 w-8 items-center justify-center rounded-[3px] bg-ink text-paper transition-colors hover:opacity-80"
                >
                  <PlusIcon width={18} height={18} />
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  )
}
