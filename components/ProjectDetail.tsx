'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Photo from './Photo'
import Reel from './Reel'
import Footer from './Footer'
import { ArrowLeft, ArrowRight, CloseIcon, PencilIcon } from './Icons'
import { useUI } from './UIProvider'
import type { Project } from '@/lib/types'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const PATTERN = [
  { span: 'md:col-span-12', ratio: '16 / 9' },
  { span: 'md:col-span-5', ratio: '4 / 5' },
  { span: 'md:col-span-7', ratio: '4 / 5' },
  { span: 'md:col-span-12', ratio: '21 / 8' },
  { span: 'md:col-span-7', ratio: '5 / 4' },
  { span: 'md:col-span-5', ratio: '5 / 4' }
]

export default function ProjectDetail({ project, next }: { project: Project; next: Project | null }) {
  const { isEdit, href, openEditor } = useUI()
  const root = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const gallery = project.photos.length ? project.photos : [project.cover]

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % gallery.length))
      if (e.key === 'ArrowLeft')
        setLightbox((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, gallery.length])

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.pd-hero-img', { scale: 1.2, autoAlpha: 0, duration: 2, ease: 'expo.out' }, 0)
        .from('.pd-line', { yPercent: 115, duration: 1.2, stagger: 0.12 }, 0.5)
        .from('.pd-sub', { autoAlpha: 0, y: 20, duration: 1 }, 0.9)

      gsap.utils.toArray<HTMLElement>('.pd-photo').forEach((el) => {
        gsap.from(el, {
          y: 70,
          autoAlpha: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' }
        })
        const img = el.querySelector('img')
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.14 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
            }
          )
        }
      })

      gsap.utils.toArray<HTMLElement>('.pd-reel').forEach((el, i) => {
        gsap.from(el, {
          y: 60,
          autoAlpha: 0,
          duration: 0.9,
          delay: i * 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%' }
        })
      })
    },
    { scope: root, dependencies: [project.id, gallery.length] }
  )

  return (
    <div ref={root}>
      <section className="relative">
        <div className="relative h-[72svh] min-h-[460px] w-full overflow-hidden">
          <div className="pd-hero-img absolute inset-0">
            <Photo src={project.cover} alt={project.title} priority sizes="100vw" className="object-cover object-top" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-paper via-paper/85 to-transparent" />
        </div>
        <div className="relative -mt-44 px-6 text-center md:-mt-52">
          <div className="overflow-hidden">
            <p className="pd-line eyebrow text-ink">
              {project.category} / {project.location}
            </p>
          </div>
          <div className="mx-auto mt-3 max-w-4xl overflow-hidden py-[0.06em]">
            <h1 className="pd-line font-serif text-[clamp(2.6rem,6.5vw,5.2rem)] leading-[1] tracking-[-0.03em]">
              {project.title}
            </h1>
          </div>
          {project.description && (
            <p className="pd-sub mx-auto mt-5 max-w-md font-sans text-base leading-relaxed text-ink/80">
              {project.description}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto mt-16 flex max-w-[1280px] items-center justify-between px-6 text-xs md:px-10">
        <Link href={href('/work')} className="flex items-center gap-2 text-ink/80 transition-colors hover:text-accent">
          <ArrowLeft width={14} height={14} /> Back to all stories
        </Link>
        <div className="flex items-center gap-6">
          <div>
            <p className="eyebrow">Location</p>
            <p className="mt-1 text-sm">{project.location || '—'}</p>
          </div>
          <span className="h-8 w-px bg-line" />
          <div>
            <p className="eyebrow">Collection</p>
            <p className="mt-1 text-sm">{project.category} story</p>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1280px] px-6 pt-14 md:px-10">
        <h2 className="font-serif text-4xl tracking-tight md:text-5xl">The photographs</h2>
        
        <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
          {gallery.map((src, i) => {
            const slot = PATTERN[i % PATTERN.length]
            return (
              <button
                key={`${src}-${i}`}
                onClick={() => setLightbox(i)}
                className={`pd-photo relative block overflow-hidden bg-line ${slot.span}`}
                style={{ aspectRatio: slot.ratio }}
              >
                <Photo
                  src={src}
                  alt={`${project.title} ${i + 1}`}
                  sizes={slot.span === 'md:col-span-12' ? '100vw' : '(min-width:768px) 58vw, 100vw'}
                  className="object-cover"
                />
              </button>
            )
          })}
        </div>
      </section>

      {project.reels.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-6 pt-24 md:px-10">
          <h2 className="font-serif text-4xl tracking-tight">In motion</h2>
          <p className="eyebrow mt-2">Reels</p>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
            {project.reels.map((r, i) => (
              <div key={`${r.src}-${i}`} className="pd-reel">
                <Reel reel={r} />
              </div>
            ))}
          </div>
        </section>
      )}

      {next && (
        <section className="mx-auto mt-24 max-w-[1280px] px-6 md:px-10">
          <Link
            href={href(`/work/${next.slug}`)}
            className="group grid items-center gap-6 border-t border-line pt-8 md:grid-cols-[1fr_1fr] md:gap-16"
          >
            <div className="relative aspect-[16/7] overflow-hidden bg-line">
              <Photo
                src={next.cover}
                alt={next.title}
                sizes="(min-width:768px) 50vw, 100vw"
                className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.05]"
              />
            </div>
            <div>
              <p className="flex items-center gap-2 font-serif text-sm text-ink/80">
                Next story <ArrowRight width={14} height={14} />
              </p>
              <p className="mt-2 font-serif text-4xl tracking-tight transition-colors group-hover:text-accent md:text-5xl">
                {next.title}
              </p>
            </div>
          </Link>
        </section>
      )}

      <div className="mt-20">
        <Footer variant="simple" />
      </div>

      {isEdit && (
        <button
          onClick={() => openEditor(project)}
          className="btn-solid fixed bottom-6 right-6 z-40 shadow-xl"
        >
          <PencilIcon width={16} height={16} /> Edit project
        </button>
      )}

      {lightbox !== null && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95"
          onClick={() => setLightbox(null)}
        >
          <div className="relative h-[86svh] w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <Photo
              src={gallery[lightbox]}
              alt={project.title}
              sizes="92vw"
              className="object-contain"
            />
          </div>
          <button
            aria-label="Close"
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 text-white/80 hover:text-white"
          >
            <CloseIcon width={26} height={26} />
          </button>
          {gallery.length > 1 && (
            <>
              <button
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightbox((lightbox - 1 + gallery.length) % gallery.length)
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                <ArrowLeft width={28} height={28} />
              </button>
              <button
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightbox((lightbox + 1) % gallery.length)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                <ArrowRight width={28} height={28} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
