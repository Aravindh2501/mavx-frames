'use client'

import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import { BRAND } from '@/lib/seo'

export default function Quote() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const section = root.current
        if (!section) return

        const card = section.querySelector<HTMLElement>('.quote-card')
        const text = section.querySelector<HTMLElement>('.quote-text')
        const rule = section.querySelector<HTMLElement>('.quote-rule')
        const caption = section.querySelector<HTMLElement>('.quote-caption')
        const glow = section.querySelector<HTMLElement>('.quote-glow')
        if (!card || !text || !rule || !caption) return

        gsap.set([text, caption], { autoAlpha: 1 })
        gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' })

        gsap.fromTo(
          card,
          { clipPath: 'inset(10% 6% 10% 6% round 28px)', autoAlpha: 0.4 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            autoAlpha: 1,
            duration: 1.6,
            ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 85%', once: true }
          }
        )

        if (glow) {
          gsap.fromTo(
            glow,
            { xPercent: -14, yPercent: -6 },
            {
              xPercent: 14,
              yPercent: 6,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
            }
          )
        }

        SplitText.create(text, {
          type: 'lines,words',
          mask: 'lines',
          autoSplit: true,
          linesClass: 'quote-line',
          wordsClass: 'quote-word',
          onSplit(self) {
            return gsap
              .timeline({
                scrollTrigger: { trigger: text, start: 'top 80%', once: true }
              })
              .from(self.words, {
                yPercent: 115,
                rotate: 5,
                autoAlpha: 0,
                filter: 'blur(10px)',
                transformOrigin: '0% 100%',
                duration: 1.4,
                stagger: { each: 0.07, ease: 'power2.in' },
                ease: 'expo.out'
              })
              .to(rule, { scaleX: 1, duration: 1.1, ease: 'silk' }, '-=0.7')
              .from(
                caption,
                { autoAlpha: 0, y: 18, letterSpacing: '0.4em', duration: 1.2, ease: 'power3.out' },
                '-=0.8'
              )
          }
        })
      })

      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      aria-label="Our philosophy"
      className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-6 md:px-10 md:pb-36"
    >
      <noscript>
        <style>{'.quote-text,.quote-caption{visibility:visible!important}'}</style>
      </noscript>
      <figure className="quote-card portfolio-quote relative isolate overflow-hidden px-6 py-14 text-center sm:px-8 sm:py-16 md:px-20 md:py-24">
        <div aria-hidden="true" className="quote-glow pointer-events-none absolute -inset-[20%] -z-10" />
        <blockquote className="quote-text relative mx-auto max-w-[20ch] font-serif text-[clamp(1.75rem,4.5vw,4.5rem)] font-medium leading-[1.15] tracking-[-0.045em]">
          Some moments pass.
          <br />
          The feeling stays.
        </blockquote>
        <span aria-hidden="true" className="quote-rule mx-auto mt-8 block h-px w-16 bg-[#F3EAE5]/50 md:mt-10" />
        <figcaption className="quote-caption relative mt-6 text-xs tracking-[0.14em] text-[#F3EAE5]/75 md:mt-7">
          {BRAND.name}
        </figcaption>
      </figure>
    </section>
  )
}
