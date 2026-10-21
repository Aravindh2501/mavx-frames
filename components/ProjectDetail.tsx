'use client'

import { isConcept, projectAlt } from '@/lib/projectSeo'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { clampRatio, DEFAULT_RATIO, useImageRatios } from '@/lib/imageRatio'
import { layoutGallery } from '@/lib/galleryLayout'
import Photo from './Photo'
import Reel from './Reel'
import Footer from './Footer'
import { ArrowLeft, ArrowRight, CloseIcon, PencilIcon } from './Icons'
import { useUI } from './UIProvider'
import type { Project } from '@/lib/types'

export default function ProjectDetail({
  project,
  next,
  ratios: initial
}: {
  project: Project
  next: Project | null
  ratios?: Record<string, number>
}) {
  const { isEdit, href, openEditor } = useUI()
  const root = useRef<HTMLDivElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const gallery = useMemo(
    () => (project.photos.length ? project.photos : [project.cover]),
    [project.photos, project.cover]
  )
  const { ratios, ready } = useImageRatios(gallery, 2500, initial)

  const tiles = useMemo(
    () => layoutGallery(gallery.map((src) => clampRatio(ratios[src] ?? DEFAULT_RATIO, 0.5, 2.4))),
    [gallery, ratios]
  )

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % gallery.length))
      if (e.key === 'ArrowLeft') setLightbox((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, gallery.length])

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.pd-hero-img', { scale: 1.2, autoAlpha: 0, duration: 2, ease: 'expo.out' }, 0)
        .from('.pd-line', { yPercent: 135, duration: 1.2, stagger: 0.12 }, 0.5)
        .from('.pd-sub', { autoAlpha: 0, y: 20, duration: 1 }, 0.9)
    },
    { scope: root, dependencies: [project.id] }
  )

  useGSAP(
    () => {
      if (!ready) return
      const photos = gsap.utils.toArray<HTMLElement>('.pd-photo')
      if (prefersReducedMotion()) {
        gsap.set(photos, { autoAlpha: 1 })
        return
      }
      gsap.set(photos, { autoAlpha: 0, y: 70 })
      ScrollTrigger.batch(photos, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power3.out',
            overwrite: true
          })
          batch.forEach((el, i) => {
            const img = el.querySelector('img')
            if (img) {
              gsap.fromTo(img, { scale: 1.1 }, { scale: 1, duration: 1.8, delay: i * 0.12, ease: 'expo.out' })
            }
          })
        }
      })
      ScrollTrigger.refresh()
    },
    { scope: root, dependencies: [project.id, ready, tiles.length], revertOnUpdate: true }
  )

  useGSAP(
    () => {
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
    { scope: root, dependencies: [project.id] }
  )

  useGSAP(
    () => {
      if (lightbox === null) return
      gsap.fromTo(overlay.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: 'power2.out' })
    },
    { scope: root, dependencies: [lightbox === null] }
  )

  useGSAP(
    () => {
      if (lightbox === null) return
      gsap.fromTo(
        stage.current,
        { autoAlpha: 0, scale: 0.96, y: 16 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.7, ease: 'expo.out' }
      )
    },
    { scope: root, dependencies: [lightbox] }
  )

  const step = (delta: number) => setLightbox((i) => (i === null ? i : (i + delta + gallery.length) % gallery.length))

  return (
    <div ref={root}>
      <section className="relative">
        <div className="relative h-[72svh] min-h-[460px] w-full overflow-hidden">
          <div className="pd-hero-img absolute inset-0">
            <Photo src={project.cover} alt={projectAlt(project)} priority sizes="100vw" className="object-cover object-top" />
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
          <div className="mask-line mx-auto mt-3 max-w-4xl">
            <h1 className="pd-line font-serif text-[clamp(2.6rem,6.5vw,5.2rem)] leading-[1.08] tracking-[-0.03em]">
              {project.title}
            </h1>
          </div>
          {isConcept(project) && <p className="mt-4 text-sm text-mute">AI-generated visual concept · Not a client shoot</p>}
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

        <div
          className="mt-10 grid grid-cols-2 items-start gap-3 md:grid-cols-12 md:gap-x-5 md:gap-y-12"
          style={{ minHeight: ready ? undefined : '60svh' }}
        >
          {tiles.map((tile) => {
            const src = gallery[tile.index]
            return (
              <button
                key={`${src}-${tile.index}`}
                onClick={() => setLightbox(tile.index)}
                aria-label={`Open photograph ${tile.index + 1}`}
                className={`pd-photo group relative block w-full overflow-hidden bg-line md:mt-[calc(var(--lift)*3.5rem)] md:[grid-column:var(--area)] ${
                  tile.full ? 'col-span-2' : 'col-span-1'
                }`}
                style={
                  {
                    aspectRatio: tile.ratio,
                    ['--area' as string]: tile.area,
                    ['--lift' as string]: tile.lift
                  } as React.CSSProperties
                }
              >
                <Photo
                  src={src}
                  alt={projectAlt(project, tile.index + 1)}
                  sizes={tile.full ? '(min-width:768px) 90vw, 100vw' : '(min-width:768px) 45vw, 50vw'}
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
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
                alt={projectAlt(next)}
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
        <button onClick={() => openEditor(project)} className="btn-solid fixed bottom-6 right-6 z-40 shadow-xl">
          <PencilIcon width={16} height={16} /> Edit project
        </button>
      )}

      {lightbox !== null && (
        <div
          ref={overlay}
          data-lenis-prevent
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95"
          onClick={() => setLightbox(null)}
        >
          <div ref={stage} className="relative h-[86svh] w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <Photo src={gallery[lightbox]} alt={projectAlt(project)} sizes="92vw" className="object-contain" />
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
                  step(-1)
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
              >
                <ArrowLeft width={28} height={28} />
              </button>
              <button
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation()
                  step(1)
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
