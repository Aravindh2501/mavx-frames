'use client'

import { useRef, useState } from 'react'
import { PlayIcon } from './Icons'
import { videoPoster } from '@/lib/cloudinary'
import type { Reel as ReelType } from '@/lib/types'

const fmt = (s: number) => `0:${String(Math.round(s)).padStart(2, '0')}`

export default function Reel({ reel }: { reel: ReelType }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState('')

  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) {
      document.querySelectorAll('video').forEach((o) => {
        if (o !== v) o.pause()
      })
      v.play()
    } else {
      v.pause()
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="reel group relative block aspect-[9/16] w-full overflow-hidden bg-ink/10 text-left"
    >
      <video
        ref={ref}
        src={reel.src}
        poster={reel.poster ?? videoPoster(reel.src)}
        playsInline
        loop
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration
          if (Number.isFinite(d)) setDuration(fmt(d))
        }}
      />
      {!playing && (
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/10 text-white backdrop-blur-sm transition-transform group-hover:scale-110">
          <PlayIcon width={16} height={16} />
        </span>
      )}
      {duration && !playing && (
        <span className="absolute bottom-3 right-3 text-[11px] text-white drop-shadow">
          {duration}
        </span>
      )}
    </button>
  )
}
