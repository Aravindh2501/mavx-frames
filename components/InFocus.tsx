'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Photo from './Photo'
import { ArrowRight, PencilIcon, PlusIcon } from './Icons'
import { useUI } from './UIProvider'
import type { Project, Shape } from '@/lib/types'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const SHAPES: Record<Shape, { h: number; r: number; radius?: string; clip?: string }> = {
  tall: { h: 1, r: 0.625 },
  wide: { h: 0.62, r: 1.4 },
  arch: { h: 0.9, r: 0.75, radius: '999px 999px 0 0' },
  square: { h: 0.62, r: 1 },
  circle: { h: 0.72, r: 1, radius: '50%' },
  pill: { h: 1, r: 0.4, radius: '999px' },
  slant: { h: 0.82, r: 0.8, clip: 'polygon(0 7%, 100% 0, 100% 93%, 0 100%)' },
  triangle: { h: 0.9, r: 1, clip: 'polygon(50% 0, 100% 100%, 0 100%)' }
}

const ALIGN = ['flex-start', 'center', 'flex-end', 'center']

export default function InFocus({ projects }: { projects: Project[] }) {
  const { isEdit, href, openEditor, openContact } = useUI()
  const root = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  useGSAP(
    () => {
      const trackEl = track.current
      const pinEl = pin.current
      if (!trackEl || !pinEl) return

      const dist = () => Math.max(0, trackEl.scrollWidth - window.innerWidth)

      const tween = gsap.to(trackEl, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) {
              bar.current.style.transform = `scaleX(${0.06 + self.progress * 0.94})`
            }
          }
        }
      })

      gsap.utils.toArray<HTMLElement>('.focus-card').forEach((card) => {
        const img = card.querySelector('.focus-img')
        if (img) {
          gsap.fromTo(
            img,
            { xPercent: -7 },
            {
              xPercent: 7,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: 'left right',
                end: 'right left',
                scrub: true
              }
            }
          )
        }
        gsap.from(card, {
          y: 70,
          autoAlpha: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: 'left 96%',
            toggleActions: 'play none none none'
          }
        })
      })

      gsap.from('.focus-head', {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%' }
      })
    },
    { scope: root, dependencies: [projects.length, isEdit], revertOnUpdate: true }
  )

  return (
    <section id="in-focus" ref={root} className="relative">
      <div ref={pin} className="flex h-[100svh] flex-col overflow-hidden bg-paper pt-24 md:pt-28">
        <div className="focus-head flex items-end justify-between px-[6vw] pb-6">
          <div>
            <h2 className="font-serif text-4xl tracking-tight md:text-5xl">In Focus</h2>
            <span className="rule" />
          </div>
          <Link
            href={href('/work')}
            className="flex items-center gap-2 text-xs text-ink/80 transition-colors hover:text-accent"
          >
            Scroll to discover more <ArrowRight width={16} height={16} />
          </Link>
        </div>

        <div
          className="relative min-h-0 flex-1"
          style={{ ['--track-h' as string]: 'clamp(280px, calc(100svh - 17.5rem), 640px)' }}
        >
          <div
            ref={track}
            className="absolute inset-y-0 left-0 flex w-max items-stretch gap-[7vw] pl-[6vw] pr-[12vw]"
          >
            {isEdit && (
              <div className="focus-card flex shrink-0 self-center">
                <button
                  onClick={() => openEditor(null)}
                  className="flex flex-col items-center justify-center gap-3 rounded border border-dashed border-mute/60 text-mute transition-colors hover:border-ink hover:text-accent"
                  style={{
                    height: 'calc(var(--track-h) * 0.6)',
                    width: 'calc(var(--track-h) * 0.45)'
                  }}
                >
                  <PlusIcon width={28} height={28} />
                  <span className="text-xs">New project</span>
                </button>
              </div>
            )}

            {projects.map((p, i) => {
              const s = SHAPES[p.shape] ?? SHAPES.tall
              const width = `calc(var(--track-h) * ${(s.h * s.r).toFixed(3)})`
              return (
                <article
                  key={p.id}
                  className="focus-card group relative flex shrink-0 flex-col"
                  style={{ alignSelf: ALIGN[i % ALIGN.length], width: `max(${width}, 11rem)` }}
                >
                  <Link href={href(`/work/${p.slug}`)} className="block">
                    <div
                      className="relative overflow-hidden bg-line"
                      style={{
                        width,
                        height: `calc(var(--track-h) * ${s.h})`,
                        borderRadius: s.radius,
                        clipPath: s.clip
                      }}
                    >
                      <Photo
                        src={p.cover}
                        alt={p.title}
                        sizes="(min-width:768px) 40vw, 80vw"
                        className="focus-img !-left-[9%] !w-[118%] !max-w-none object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-lg leading-tight md:text-xl">{p.title}</h3>
                        <p className="eyebrow mt-1.5">{p.location || p.category}</p>
                      </div>
                      <span className="eyebrow">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                  </Link>
                  {isEdit && (
                    <button
                      onClick={() => openEditor(p)}
                      aria-label="Edit project"
                      className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper/95 text-ink shadow-md transition-colors hover:bg-ink hover:text-paper"
                    >
                      <PencilIcon width={16} height={16} />
                    </button>
                  )}
                </article>
              )
            })}

            <div className="focus-card flex shrink-0 flex-col justify-center gap-5 pl-[4vw]">
              <span className="eyebrow">Next chapter</span>
              <p className="max-w-[18rem] font-serif text-3xl leading-tight tracking-tight">
                Yours could be <span className="italic text-accent">the next story.</span>
              </p>
              <div className="flex gap-3">
                <button onClick={openContact} className="btn-solid">
                  Let’s talk
                </button>
                <Link href={href('/work')} className="btn-ghost">
                  All work
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="px-[6vw] pb-8 pt-4">
          <div className="relative h-px bg-line">
            <div
              ref={bar}
              className="absolute left-0 top-0 h-px w-full origin-left bg-ink"
              style={{ transform: 'scaleX(0.06)' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
