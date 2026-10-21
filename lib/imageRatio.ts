'use client'

import { useEffect, useMemo, useState } from 'react'
import { cloudinaryLoader, isCloudinary } from './cloudinary'

export type Orientation = 'landscape' | 'portrait' | 'square'

export const DEFAULT_RATIO = 4 / 5

const cache = new Map<string, number>()
const pending = new Map<string, Promise<number>>()

export const orientationOf = (ratio: number): Orientation =>
  ratio >= 1.12 ? 'landscape' : ratio <= 0.9 ? 'portrait' : 'square'

export const clampRatio = (ratio: number, min: number, max: number) => Math.min(max, Math.max(min, ratio))

const probeUrl = (src: string) => {
  if (isCloudinary(src)) return cloudinaryLoader({ src, width: 128 })
  if (src.startsWith('/')) return `/_next/image?url=${encodeURIComponent(src)}&w=64&q=40`
  return src
}

const load = (url: string) =>
  new Promise<number>((resolve, reject) => {
    const img = new window.Image()
    img.decoding = 'async'
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) resolve(img.naturalWidth / img.naturalHeight)
      else reject(new Error('empty'))
    }
    img.onerror = () => reject(new Error('failed'))
    img.src = url
  })

export const probeRatio = (src: string): Promise<number> => {
  const hit = cache.get(src)
  if (hit) return Promise.resolve(hit)
  const inflight = pending.get(src)
  if (inflight) return inflight
  const task = load(probeUrl(src))
    .catch(() => load(src))
    .then((ratio) => {
      cache.set(src, ratio)
      return ratio
    })
    .catch(() => DEFAULT_RATIO)
    .finally(() => pending.delete(src))
  pending.set(src, task)
  return task
}

const fromCache = (srcs: string[]) => {
  const out: Record<string, number> = {}
  srcs.forEach((s) => {
    const hit = cache.get(s)
    if (hit) out[s] = hit
  })
  return out
}

export function useImageRatios(input: string[], timeout = 2500) {
  const key = input.filter(Boolean).join('|')
  const srcs = useMemo(() => (key ? key.split('|') : []), [key])
  const [ratios, setRatios] = useState<Record<string, number>>({})
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    let alive = true
    setExpired(false)
    setRatios(fromCache(srcs))
    const timer = window.setTimeout(() => alive && setExpired(true), timeout)
    Promise.all(srcs.map(probeRatio)).then((list) => {
      if (!alive) return
      window.clearTimeout(timer)
      setRatios(Object.fromEntries(srcs.map((s, i) => [s, list[i]])))
    })
    return () => {
      alive = false
      window.clearTimeout(timer)
    }
  }, [srcs, timeout])

  const ready = expired || srcs.every((s) => ratios[s] !== undefined)
  const ratioOf = (src: string) => ratios[src] ?? DEFAULT_RATIO

  return { ratios, ratioOf, ready }
}
