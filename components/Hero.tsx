// components/Hero.tsx
'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Photo from './Photo'
import { BRAND } from '@/lib/seo'

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface Props {
  images: { wide: string; portrait: string; small: string }
}

export default function Hero({ images }: Props) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.hero-line', { yPercent: 118, duration: 1.3, stagger: 0.14 }, 0.15)
        .from('.hero-sub', { autoAlpha: 0, y: 22, duration: 1 }, 1.05)
        .fromTo(
          '.hero-frame',
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, stagger: 0.18, ease: 'expo.out' },
          0.2
        )
        .from('.hero-frame img', { scale: 1.35, duration: 2.2, stagger: 0.18, ease: 'expo.out' }, 0.2)
    },
    { scope: root }
  )

  return (
    <section ref={root} className="relative pt-24 sm:pt-28 md:pt-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 md:px-10">
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <h1 className="font-serif text-[clamp(2.9rem,7.2vw,6.5rem)] leading-[1.02] tracking-[-0.07em]">
              <span className="sr-only">{BRAND.name} — wedding and event photographer in Chennai, travelling across Tamil Nadu. </span>
              <span className="block overflow-hidden py-[0.06em]">
                <span className="hero-line block">The art</span>
              </span>
              <span className="block overflow-hidden py-[0.02em]">
                <span className="hero-line block">of</span>
              </span>
              <span className="block overflow-hidden py-[0.06em]">
                <span className="hero-line block text-accent">noticing.</span>
              </span>
            </h1>
          </div>

          <div className="home-hero-media">
            <div className="home-hero-portrait">
              <div className="hero-frame relative aspect-[4/5] overflow-hidden shadow-[0_24px_60px_-24px_rgba(20,18,17,0.35)] md:aspect-[0.55]">
                <Photo src={images.portrait} alt={`Wedding portrait by ${BRAND.name}, photographer in Chennai`} priority sizes="(min-width:768px) 28vw, 100vw" className="object-cover" />
              </div>
            </div>
            <div className="home-hero-small">
              <div className="hero-frame relative aspect-[4/3] overflow-hidden shadow-[0_24px_60px_-24px_rgba(20,18,17,0.35)] md:aspect-[1.4]">
                <Photo src={images.small} alt={`Candid wedding moment photographed by ${BRAND.name} in Tamil Nadu`} priority sizes="(min-width:768px) 23vw, 50vw" className="object-cover" />
              </div>
            </div>
            <div className="home-hero-wide">
              <div className="hero-frame relative aspect-[4/3] overflow-hidden shadow-[0_24px_60px_-24px_rgba(20,18,17,0.35)] md:aspect-[2.5]">
                <Photo src={images.wide} alt={`Wedding photography in Chennai and Coimbatore by ${BRAND.name}`} priority sizes="(min-width:768px) 40vw, 50vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}