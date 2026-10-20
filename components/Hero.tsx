'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Photo from './Photo'

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
        .from('.hero-rule', { scaleX: 0, transformOrigin: 'left center', duration: 0.9 }, 0.95)
        .from('.hero-sub', { autoAlpha: 0, y: 22, duration: 1 }, 1.05)
        .fromTo(
          '.hero-frame',
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, stagger: 0.18, ease: 'expo.out' },
          0.2
        )
        .from('.hero-frame img', { scale: 1.35, duration: 2.2, stagger: 0.18, ease: 'expo.out' }, 0.2)

      gsap.utils.toArray<HTMLElement>('.hero-float').forEach((el, i) => {
        gsap.to(el, {
          yPercent: (i + 1) * -7,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        })
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} className="relative pt-28 md:pt-32">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="md:relative md:h-[min(84svh,800px)]">
          <div className="md:absolute md:left-0 md:top-[6%] md:w-[52%]">
            <h1 className="font-serif text-[clamp(3.6rem,9.5vw,8.6rem)] leading-[0.92] tracking-[-0.035em]">
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
            <span className="hero-rule mt-6 block h-px w-8 bg-ink" />
            <p className="hero-sub mt-5 max-w-[19rem] font-serif text-[15px] leading-relaxed text-ink/80">
              Weddings, people and the quiet moments that make them unforgettable.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:contents">
            <div className="hero-float col-span-2 md:absolute md:left-[47%] md:top-0 md:w-[27%]">
              <div className="hero-frame relative aspect-[4/5] overflow-hidden shadow-[0_24px_60px_-24px_rgba(20,18,17,0.35)] md:aspect-[0.5]">
                <Photo src={images.portrait} alt="" priority sizes="(min-width:768px) 28vw, 100vw" className="object-cover" />
              </div>
            </div>
            <div className="hero-float md:absolute md:left-[77%] md:top-[3%] md:w-[23%]">
              <div className="hero-frame relative aspect-[4/3] overflow-hidden shadow-[0_24px_60px_-24px_rgba(20,18,17,0.35)] md:aspect-[1.4]">
                <Photo src={images.small} alt="" priority sizes="(min-width:768px) 23vw, 50vw" className="object-cover" />
              </div>
            </div>
            <div className="hero-float md:absolute md:bottom-[2%] md:left-0 md:w-[40%]">
              <div className="hero-frame relative aspect-[4/3] overflow-hidden shadow-[0_24px_60px_-24px_rgba(20,18,17,0.35)] md:aspect-[2.5]">
                <Photo src={images.wide} alt="" priority sizes="(min-width:768px) 40vw, 50vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
