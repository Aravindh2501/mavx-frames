'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { MoonIcon, SunIcon } from './Icons'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const icon = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => {
      let saved: string | null = null
      try { saved = localStorage.getItem('theme') } catch {}
      const next = saved ? saved === 'dark' : media.matches
      document.documentElement.classList.toggle('dark', next)
      setDark(next)
    }
    media.addEventListener('change', sync)
    window.addEventListener('storage', sync)
    return () => { media.removeEventListener('change', sync); window.removeEventListener('storage', sync) }
  }, [])

  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
    setDark(next)
    if (icon.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(
        icon.current,
        { rotate: -70, scale: 0.6, opacity: 0 },
        { rotate: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out', clearProps: 'all' }
      )
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className="nav-icon-btn"
    >
      <span ref={icon} className="flex">
        {dark ? <SunIcon width={17} height={17} /> : <MoonIcon width={17} height={17} />}
      </span>
    </button>
  )
}
