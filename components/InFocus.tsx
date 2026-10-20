'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Photo from './Photo'
import { PencilIcon, PlusIcon } from './Icons'
import { useUI } from './UIProvider'
import type { Project } from '@/lib/types'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function InFocus({ projects }: { projects: Project[] }) {
  const { isEdit, href, openEditor, openContact } = useUI()
  const root = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  useGSAP(
    () => {
      const trackEl = track.current
      const pinEl = pin.current
      if (!trackEl || !pinEl) return

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        pinEl.style.height = 'auto'; trackEl.style.position = 'relative'; trackEl.style.width = '100%'; trackEl.style.flexWrap = 'wrap';
        return () => { pinEl.style.height = ''; trackEl.style.position = ''; trackEl.style.width = ''; trackEl.style.flexWrap = '' }
      }

      const dist = () => Math.max(0, trackEl.scrollWidth - window.innerWidth)

      const tween = gsap.to(trackEl, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinEl,
          start: 'top top',
          end: () => `+=${dist() * 0.85}`,
          pin: true,
          // Lenis already smooths the scroll — extra scrub lag here made it feel slow
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      })

      gsap.utils.toArray<HTMLElement>('.focus-card').forEach((card) => {
        const img = card.querySelector('.focus-img')
        if (img) {
          gsap.fromTo(
            img,
            { xPercent: -7, scale: 0.96 },
            {
              xPercent: 7,
              scale: 1,
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
          y: 50,
          autoAlpha: 0,
          duration: 0.9,
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
    { scope: root, dependencies: [projects, isEdit], revertOnUpdate: true }
  )

  return (
    <section id="in-focus" ref={root} className="relative">
      <div ref={pin} className="flex h-[100svh] flex-col overflow-hidden bg-paper pt-24 md:pt-28">
        <div className="focus-head flex items-end justify-between px-[6vw] pb-12">
          <div>
            <h2 className="font-serif text-4xl tracking-tight md:text-6xl">In Focus</h2>
            
          </div>
          <Link
            href={href('/work')}
            className="flex items-center gap-2 text-xs text-ink/80 transition-colors hover:text-accent"
          >
            Explore all work
          </Link>
        </div>

        <div
          className="relative min-h-0 flex-1"
          style={{ ['--track-h' as string]: 'clamp(280px, calc(100svh - 17.5rem), 640px)' }}
        >
          <div
            ref={track}
            className="gpu absolute inset-y-0 left-0 flex w-max items-stretch focus-track"
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
              const width = '100%'
              return (
                <article
                  key={p.id}
                  className="focus-card group relative flex shrink-0 flex-col"
                  style={{ alignSelf: i % 2 === 0 ? 'flex-end' : 'flex-start' }}
                >
                  <Link href={href(`/work/${p.slug}`)} className="block">
                    <div
                      className="focus-media relative overflow-hidden bg-line"
                      style={{
                        width,
                        borderRadius: p.shape === 'arch' ? '999px 999px 0 0' : p.shape === 'circle' || p.shape === 'pill' ? '999px' : undefined,
                        clipPath: p.shape === 'slant' ? 'polygon(0 7%,100% 0,100% 93%,0 100%)' : p.shape === 'triangle' ? 'polygon(50% 0,100% 100%,0 100%)' : undefined,
                        
                        
                        
                      }}
                    >
                      {/* GSAP moves .focus-img; hover zoom lives on the inner div so CSS
                          transitions never fight the scroll-driven transform */}
                      <div className="focus-img gpu absolute inset-y-0 -left-[9%] w-[118%]">
                        <div className="relative h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]">
                          <Photo
                            src={p.cover}
                            alt={p.title}
                            sizes="(min-width:768px) 40vw, 80vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
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

        <div className="pb-8" />
      </div>
    </section>
  )
}
