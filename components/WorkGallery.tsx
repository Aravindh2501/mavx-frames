'use client'

import { isConcept, projectAlt } from '@/lib/projectSeo'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { gsap, Flip, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { clampRatio, useImageRatios } from '@/lib/imageRatio'
import Photo from './Photo'
import Reel from './Reel'
import { PencilIcon, PlusIcon } from './Icons'
import { useUI } from './UIProvider'
import { CATEGORIES } from '@/lib/types'
import type { Project } from '@/lib/types'

export default function WorkGallery({ projects, ratios: seeded }: { projects: Project[]; ratios?: Record<string, number> }) {
  const { isEdit, href, openEditor } = useUI()
  const params = useSearchParams()
  const root = useRef<HTMLElement>(null)
  const tabsRow = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const flipState = useRef<Flip.FlipState | null>(null)

  const tabs = useMemo(() => {
    const cats = Array.from(new Set([...CATEGORIES, ...projects.map((p) => p.category)]))
    return ['All', ...cats, 'Reels']
  }, [projects])

  const initial = params.get('type')
  const [active, setActive] = useState(initial && tabs.includes(initial) ? initial : 'All')

  const items = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.category === active)),
    [projects, active]
  )

  const reels = useMemo(
    () => projects.flatMap((p) => p.reels.map((r) => ({ reel: r, project: p }))),
    [projects]
  )

  const { ratioOf, ready } = useImageRatios(useMemo(() => projects.map((p) => p.cover), [projects]), 2500, seeded)

  const select = (key: string) => {
    if (key === active) return
    if (root.current && !prefersReducedMotion()) {
      flipState.current = Flip.getState(root.current.querySelectorAll('.wg-item'))
    }
    setActive(key)
    const url = new URL(window.location.href)
    if (key === 'All') url.searchParams.delete('type')
    else url.searchParams.set('type', key)
    window.history.replaceState(null, '', url)
  }

  const centerActiveTab = (animate: boolean) => {
    const el = tabRefs.current[active]
    const row = tabsRow.current
    if (!el || !row) return
    const left = el.offsetLeft - row.clientWidth / 2 + el.offsetWidth / 2
    row.scrollTo({ left, behavior: animate ? 'smooth' : 'auto' })
  }

  useEffect(() => {
    centerActiveTab(true)
  }, [active, tabs])

  useEffect(() => {
    const onResize = () => centerActiveTab(false)
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(() => centerActiveTab(false))
    return () => window.removeEventListener('resize', onResize)
  }, [active])

  useGSAP(
    () => {
      gsap.from('.wg-head > *', { y: 40, autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out' })
    },
    { scope: root }
  )

  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>('.wg-item')
      const state = flipState.current
      flipState.current = null

      if (!targets.length || prefersReducedMotion()) {
        gsap.set(targets, { autoAlpha: 1, y: 0 })
        return
      }

      if (state && state.targets.length) {
        Flip.from(state, {
          targets,
          duration: 0.9,
          ease: 'silk',
          stagger: 0.03,
          onEnter: (entering) =>
            gsap.fromTo(
              entering,
              { autoAlpha: 0, y: 50 },
              { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, ease: 'power3.out' }
            )
        })
        return
      }

      gsap.fromTo(
        targets,
        { y: 50, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07, ease: 'power3.out' }
      )
    },
    { scope: root, dependencies: [active, items.length, ready] }
  )

  return (
    <section ref={root} className="mx-auto max-w-[1280px] px-6 pb-24 pt-20 md:px-10 md:pt-28">
      <div className="wg-head flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 className="font-serif text-[clamp(2.4rem,5.5vw,4.5rem)] leading-none tracking-[-0.03em]">
          Every story, <span className="italic text-accent">told.</span>
        </h2>
        <p className="max-w-xs text-sm leading-relaxed text-mute">Pick a category to explore.</p>
      </div>

      <div className="sticky top-[3.6rem] z-30 -mx-6 mt-10 bg-paper/85 px-6 py-3 backdrop-blur-md md:-mx-10 md:px-10">
        <div ref={tabsRow} className="no-scrollbar relative flex gap-1 overflow-x-auto pb-3">
          {tabs.map((key) => (
            <button
              key={key}
              ref={(el) => {
                tabRefs.current[key] = el
              }}
              onClick={() => select(key)}
              aria-pressed={active === key}
              className={`work-tab relative z-10 flex shrink-0 items-center gap-1.5 text-sm transition-colors duration-300 ${
                active === key ? 'font-semibold text-accent' : 'text-ink/70 hover:text-ink'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        {active === 'Reels' ? (
          reels.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {reels.map(({ reel, project }, i) => (
                <div key={`${project.id}-${i}`} className="wg-item">
                  <Reel reel={reel} />
                  <Link
                    href={href(`/work/${project.slug}`)}
                    className="mt-3 block font-serif text-base leading-tight hover:text-accent"
                  >
                    {project.title}
                    <span className="eyebrow mt-1 block">{project.category}</span>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <Empty label="Reels" isEdit={isEdit} onAdd={() => openEditor(null)} />
          )
        ) : items.length ? (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {items.map((p) => (
              <article
                key={p.id}
                data-flip-id={p.id}
                className="wg-item group relative mb-8 break-inside-avoid"
              >
                <Link href={href(`/work/${p.slug}`)} className="block">
                  <div
                    className="relative overflow-hidden bg-line"
                    style={{ aspectRatio: clampRatio(ratioOf(p.cover), 0.66, 1.8) }}
                  >
                    <Photo
                      src={p.cover}
                      alt={projectAlt(p)}
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-ink">
                      {p.category}
                    </span>
                    {p.reels.length > 0 && (
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
                        {p.reels.length} {p.reels.length === 1 ? 'reel' : 'reels'}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-xl leading-tight transition-colors group-hover:text-accent">
                      {p.title}
                    </h3>
                    <span className="text-xs text-mute">{isConcept(p) ? 'AI-generated concept' : p.location}</span>
                  </div>
                </Link>
                {isEdit && (
                  <button
                    onClick={() => openEditor(p)}
                    aria-label="Edit project"
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper/95 text-ink shadow-md transition-colors hover:bg-ink hover:text-paper"
                  >
                    <PencilIcon width={16} height={16} />
                  </button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <Empty label={active} isEdit={isEdit} onAdd={() => openEditor(null)} />
        )}
      </div>
    </section>
  )
}

function Empty({ label, isEdit, onAdd }: { label: string; isEdit: boolean; onAdd: () => void }) {
  return (
    <div className="wg-item flex flex-col items-center gap-4 py-24 text-center">
      <p className="font-serif text-3xl">
        {label} stories are <span className="italic text-accent">on their way.</span>
      </p>
      <p className="text-sm text-mute">Nothing here just yet.</p>
      {isEdit && (
        <button onClick={onAdd} className="btn-solid">
          <PlusIcon width={16} height={16} /> Add a project
        </button>
      )}
    </div>
  )
}
