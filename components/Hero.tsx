'use client'

import { useMemo, useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { clampRatio, useImageRatios } from '@/lib/imageRatio'
import Photo from './Photo'
import { BRAND } from '@/lib/seo'
import { WEDDINGS_ENABLED } from '@/lib/focus'

export interface HeroImage {
  src: string
  alt: string
}

interface Props {
  pool: HeroImage[]
  ratios?: Record<string, number>
}

type Slot = 'portrait' | 'small' | 'wide'

const SLOT_RANGE: Record<Slot, [number, number]> = {
  portrait: [0.62, 0.88],
  small: [1.2, 1.7],
  wide: [1.3, 1.9]
}

const SLOT_FALLBACK: Record<Slot, number> = { portrait: 0.7, small: 1.4, wide: 1.5 }

function pickImages(pool: string[], ratios: Record<string, number>) {
  const used = new Set<string>()
  const take = (test: (ratio: number) => boolean) => {
    const hit =
      pool.find((s) => !used.has(s) && ratios[s] !== undefined && test(ratios[s])) ??
      pool.find((s) => !used.has(s)) ??
      pool[0]
    if (hit) used.add(hit)
    return hit ?? ''
  }
  return {
    portrait: take((r) => r <= 0.9),
    small: take((r) => r >= 1.12),
    wide: take((r) => r >= 1.12)
  }
}

export default function Hero({ pool, ratios: initial }: Props) {
  const root = useRef<HTMLElement>(null)
  const srcs = useMemo(() => pool.map((p) => p.src), [pool])
  const { ratios, ready } = useImageRatios(srcs, 1800, initial)
  const picks = useMemo(() => pickImages(srcs, ratios), [srcs, ratios])
  const altFor = (src: string) => pool.find((p) => p.src === src)?.alt ?? BRAND.name

  const ratioFor = (slot: Slot) => {
    const known = ratios[picks[slot]]
    if (known === undefined) return SLOT_FALLBACK[slot]
    const [min, max] = SLOT_RANGE[slot]
    return clampRatio(known, min, max)
  }

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('.hero-line', { yPercent: 135, duration: 1.3, stagger: 0.14 }, 0.15)
    },
    { scope: root }
  )

  useGSAP(
    () => {
      if (!ready) return
      if (prefersReducedMotion()) {
        gsap.set('.hero-frame', { clipPath: 'inset(0% 0% 0% 0%)' })
        return
      }
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(
          '.hero-frame',
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, stagger: 0.18 },
          0
        )
        .from('.hero-frame img', { scale: 1.35, duration: 2.2, stagger: 0.18 }, 0)
    },
    { scope: root, dependencies: [ready] }
  )

  const frame = 'hero-frame relative overflow-hidden shadow-[0_24px_60px_-24px_rgba(20,18,17,0.35)]'
  const hidden = undefined

  return (
    <section ref={root} className="relative pt-24 sm:pt-28 md:pt-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 md:px-10">
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <h1 className="font-serif text-[clamp(2.9rem,7.2vw,6.5rem)] leading-[1.06] tracking-[-0.07em]">
              <span className="mask-line block">
                <span className="hero-line block">Your story.</span>
              </span>
              <span className="mask-line block">
                <span className="hero-line block">Every</span>
              </span>
              <span className="mask-line block">
                <span className="hero-line block text-accent">frame.</span>
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-mute">{WEDDINGS_ENABLED ? 'Wedding, portrait and brand photography. Films that bring you back. Based in Chennai and Coimbatore, travelling across Tamil Nadu.' : 'Portrait, fashion and reel photography. Films that bring you back. Based in Chennai and Coimbatore, travelling across Tamil Nadu.'}</p>
          </div>

          <div className="home-hero-media">
            <div className="home-hero-portrait">
              <div
                className={`${frame} mx-auto w-[76%] md:w-full`}
                style={{ aspectRatio: ratioFor('portrait'), visibility: hidden }}
              >
                <Photo
                  src={picks.portrait}
                  alt={altFor(picks.portrait)}
                  priority
                  sizes="(min-width:768px) 28vw, 76vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="home-hero-small">
              <div className={frame} style={{ aspectRatio: ratioFor('small'), visibility: hidden }}>
                <Photo
                  src={picks.small}
                  alt={altFor(picks.small)}
                  priority
                  sizes="(min-width:768px) 23vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="home-hero-wide">
              <div className={frame} style={{ aspectRatio: ratioFor('wide'), visibility: hidden }}>
                <Photo
                  src={picks.wide}
                  alt={altFor(picks.wide)}
                  priority
                  sizes="(min-width:768px) 40vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
