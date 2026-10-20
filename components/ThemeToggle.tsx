'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { MoonIcon, SunIcon } from './Icons'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const icon = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {}
    setDark(next)
    if (icon.current) {
      gsap.fromTo(
        icon.current,
        { rotate: -90, scale: 0.5, autoAlpha: 0 },
        { rotate: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.7)' }
      )
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className="nav-item flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-60"
    >
      <span ref={icon} className="flex">
        {dark ? <SunIcon width={18} height={18} /> : <MoonIcon width={18} height={18} />}
      </span>
    </button>
  )
}
