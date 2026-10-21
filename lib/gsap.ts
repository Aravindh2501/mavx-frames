import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, CustomEase)

CustomEase.create('silk', '0.22, 1, 0.36, 1')
CustomEase.create('glide', '0.65, 0, 0.35, 1')

gsap.defaults({ ease: 'silk', duration: 1 })

export const EASE = {
  silk: 'silk',
  glide: 'glide',
  reveal: 'expo.out',
  soft: 'power3.out',
  title: 'power4.out'
} as const

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger, SplitText, Flip, CustomEase, useGSAP }
