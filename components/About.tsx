'use client'

import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import Link from 'next/link'
import Photo from './Photo'
import { site } from '@/lib/site'
import { BRAND } from '@/lib/seo'

export default function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const st = { trigger: root.current, start: 'top 70%' }
      gsap.from('.about-label', { autoAlpha: 0, y: 20, duration: 0.8, scrollTrigger: st })
      gsap.fromTo(
        '.about-frame',
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.out', scrollTrigger: st }
      )
      gsap.from('.about-frame img', {
        scale: 1.3,
        duration: 2,
        ease: 'expo.out',
        scrollTrigger: st
      })
      gsap.from('.about-line', {
        yPercent: 115,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power4.out',
        scrollTrigger: st
      })
      gsap.from('.about-text', {
        autoAlpha: 0,
        y: 24,
        duration: 1,
        delay: 0.35,
        ease: 'power3.out',
        scrollTrigger: st
      })
    },
    { scope: root }
  )

  return (
    <section
      id="about"
      ref={root}
      className="mx-auto max-w-[1280px] px-5 py-16 sm:px-6 md:py-24 lg:px-10 lg:py-36"
    >
      <div className="about-label">
        <h2 className="font-serif text-3xl md:text-4xl">Behind the Lens</h2>
      </div>

      <div className="mt-8 grid items-center gap-10 md:mt-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="about-frame relative mx-auto aspect-[1/1.05] w-full max-w-md overflow-hidden bg-line lg:ml-[12%] lg:max-w-none">
          <Photo
            src={site.aboutImage}
            alt="Wedding detail concept from the MAVX Frames visual collection"
            sizes="(min-width:1024px) 30vw, (min-width:448px) 448px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="min-w-0">
          <h3 className="font-serif text-[clamp(2.25rem,6vw,5rem)] leading-[1] tracking-[-0.03em]">
            {site.aboutHeading.map((line) => (
              <span key={line} className="block overflow-hidden py-[0.05em]">
                <span className="about-line block">{line}</span>
              </span>
            ))}
          </h3>
          <p className="about-text mt-6 max-w-md font-sans text-base leading-relaxed text-mute md:mt-7">
            {site.aboutText}
          </p>
          <Link href="/about" className="about-text btn-ghost mt-6 inline-flex min-h-[44px] items-center px-0">
            Read more
          </Link>
        </div>
      </div>
    </section>
  )
}