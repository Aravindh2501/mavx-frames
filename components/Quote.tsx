
'use client'

import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '@/lib/gsap'
import { BRAND } from '@/lib/seo'

export default function Quote() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = root.current
      if (!section) return

      const card = section.querySelector<HTMLElement>('.quote-card')
      const text = section.querySelector<HTMLElement>('.quote-text')
      const rule = section.querySelector<HTMLElement>('.quote-rule')
      const caption = section.querySelector<HTMLElement>('.quote-caption')
      const glow = section.querySelector<HTMLElement>('.quote-glow')

      if (!card || !text || !rule || !caption) return

    gsap.set(rule, {
  scaleX: 1,
  transformOrigin: 'left center',
})

      gsap.set(rule, {
        scaleX: 1,
        transformOrigin: 'left center',
      })

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        // No animation for users who prefer reduced motion.
        gsap.set([card, text, rule, caption], {
          clearProps: 'all',
        })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Animate the card without hiding its contents.
        gsap.fromTo(
          card,
          {
            clipPath: 'inset(6% 3% 6% 3% round 20px)',
          },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              once: true,
            },
          }
        )

        // Gentle background movement while scrolling.
        if (glow) {
          gsap.fromTo(
            glow,
            { xPercent: -8, yPercent: -4 },
            {
              xPercent: 8,
              yPercent: 4,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            }
          )
        }

        // Split and animate the words when the text is ready.
        SplitText.create(text, {
          type: 'lines,words',
          mask: 'lines',
          autoSplit: true,
          linesClass: 'quote-line',
          wordsClass: 'quote-word',

          onSplit(self) {
            // The original text remains visible until this timeline runs.
            gsap.set(self.words, {
              autoAlpha: 1,
              clearProps: 'filter,transform',
            })

            return gsap
              .timeline({
                scrollTrigger: {
                  trigger: text,
                  start: 'top 90%',
                  once: true,
                },
              })
              .from(self.words, {
                yPercent: 35,
                rotate: 2,
                filter: 'blur(3px)',
                duration: 0.8,
                stagger: 0.045,
                ease: 'expo.out',
              })
              .from(
                rule,
                {
                  scaleX: 0,
                  duration: 0.7,
                  ease: 'power3.out',
                },
                '-=0.35'
              )
              .from(
                caption,
                {
                  y: 8,
                  autoAlpha: 0,
                  duration: 0.65,
                  ease: 'power3.out',
                },
                '-=0.3'
              )
          },
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
      <figure className="quote-card portfolio-quote relative isolate overflow-hidden px-6 py-14 text-center sm:px-8 sm:py-16 md:px-20 md:py-24">
        <div
          aria-hidden="true"
          className="quote-glow pointer-events-none absolute -inset-[20%] -z-10"
        />

        <blockquote className="quote-text relative mx-auto max-w-[20ch] font-serif text-[clamp(1.75rem,4.5vw,4.5rem)] font-medium leading-[1.15] tracking-[-0.045em]">
          Some moments pass.
          <br />
          The feeling stays.
        </blockquote>

        <span
          aria-hidden="true"
          className="quote-rule mx-auto mt-8 block h-px w-16 origin-left bg-[#F3EAE5]/50 md:mt-10"
        />

        <figcaption className="quote-caption relative mt-6 text-xs tracking-[0.14em] text-[#F3EAE5]/75 md:mt-7">
          {BRAND.name}
        </figcaption>
      </figure>
    </section>
  )
}
