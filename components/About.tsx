'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Photo from './Photo'
import { site } from '@/lib/site'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
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
    <section id="about" ref={root} className="mx-auto max-w-[1280px] px-6 py-24 md:px-10 md:py-36">
      <div className="about-label">
        <h2 className="font-serif text-3xl md:text-4xl">Behind the Lens</h2>
        
      </div>
      <div className="mt-10 grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div className="about-frame relative aspect-[1/1.05] overflow-hidden bg-line md:ml-[12%]">
          <Photo src={site.aboutImage} alt="MAVX Frames" sizes="(min-width:768px) 30vw, 100vw" className="object-cover" />
        </div>
        <div>
          <h3 className="font-serif text-[clamp(2.6rem,6vw,5rem)] leading-[1] tracking-[-0.03em]">
            {site.aboutHeading.map((line) => (
              <span key={line} className="block overflow-hidden py-[0.05em]">
                <span className="about-line block">{line}</span>
              </span>
            ))}
          </h3>
          <p className="about-text mt-7 max-w-md font-sans text-base leading-relaxed text-mute">
            {site.aboutText}
          </p>
        </div>
      </div>
    </section>
  )
}
