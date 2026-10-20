'use client'

import Image from 'next/image'
import { cloudinaryLoader, isCloudinary } from '@/lib/cloudinary'

interface Props {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
}

export default function Photo({ src, alt, sizes = '100vw', priority, className }: Props) {
  const safeSrc = src || '/images/a-love-quietly-told.png'
  const cld = isCloudinary(safeSrc)
  return (
    <Image
      src={safeSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      loader={cld ? cloudinaryLoader : undefined}
      unoptimized={!cld && !safeSrc.startsWith('/')}
      draggable={false}
    />
  )
}
