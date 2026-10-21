'use client'

import { isConcept, projectAlt } from '@/lib/projectSeo'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap, useGSAP } from '@/lib/gsap'
import Photo from './Photo'
import { useUI } from './UIProvider'
import type { Project } from '@/lib/types'

const INTERVAL = 5500

export default function WorkHero({ slides }: { slides: Project[] }) {
  const { href } = useUI()
  const root = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const count = slides.length

  useEffect(() => {
    if (count < 2) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL)
    return () => window.clearTimeout(id)
  }, [index, count])

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('.wh-slide')
      items.forEach((el, i) => {
        if (i === index) {
          gsap.set(el, { zIndex: 2 })
          gsap.fromTo(
            el,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 1.5, ease: 'power2.inOut', overwrite: 'auto' }
          )
          const img = el.querySelector('img')
          if (img) {
            gsap.fromTo(img, { scale: 1.16 }, { scale: 1, duration: 8, ease: 'power1.out' })
          }
        } else {
          gsap.set(el, { zIndex: 1 })
          gsap.to(el, { autoAlpha: 0, duration: 1.5, ease: 'power2.inOut', overwrite: 'auto' })
        }
      })
      gsap.fromTo(
        '.wh-line',
        { yPercent: 120 },
        { yPercent: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out', delay: 0.35 }
      )
    },
    { scope: root, dependencies: [index] }
  )

  useGSAP(
    () => {
      gsap.from('.wh-ui', { autoAlpha: 0, y: 20, duration: 1, stagger: 0.1, delay: 0.8, ease: 'power3.out' })
    },
    { scope: root }
  )

  if (!count) return null
  const current = slides[index]
  const go = (n: number) => setIndex((n + count) % count)

  return (
    <section ref={root} className="work-landing relative w-full overflow-hidden bg-black">
      {slides.map((p, i) => (
        <div key={p.id} className="wh-slide absolute inset-0" style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? 'visible' : 'hidden' }}>
          <Photo src={p.cover} alt={projectAlt(p)} priority={i === 0} sizes="100vw" className="object-cover" />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center px-6 pb-28 text-center text-white md:pb-32">
        <div className="overflow-hidden">
          <p className="wh-line text-[11px] uppercase tracking-[0.3em] text-white/80">
            {isConcept(current) ? 'AI-generated concept' : current.category}
            {current.location ? ` · ${current.location}` : ''}
          </p>
        </div>
        <div className="mt-4 overflow-hidden py-[0.06em]">
          <h2 className="wh-line max-w-[18ch] font-serif text-[clamp(2.8rem,8vw,7rem)] leading-[0.98] tracking-[-0.03em]">
            {current.title}
          </h2>
        </div>
        <Link
          href={href(`/work/${current.slug}`)}
          className="wh-ui mt-7 inline-flex items-center gap-2 py-2 text-sm transition-opacity hover:opacity-70"
        >
          View story
        </Link>
      </div>

      {count > 1 && (
        <>
          <div className="wh-ui absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-4 px-6 text-white">
            <div className="flex items-center gap-2">
              {slides.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => go(i)}
                  aria-label={`Show ${p.title}`}
                  aria-current={i === index ? 'true' : undefined}
                  className="group relative h-6 w-8 sm:w-12"
                >
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/35" />
                  {i === index && (
                    <span
                      key={index}
                      className="tick-fill absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-white"
                      style={{ ['--tick-ms' as string]: `${INTERVAL}ms` }}
                    />
                  )}
                  {i < index && (
                    <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-white/70" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="wh-ui absolute right-6 top-28 z-20 hidden text-[11px] tracking-[0.25em] text-white/80 md:block md:right-10">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </div>
        </>
      )}
    </section>
  )
}
