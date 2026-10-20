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
  const cld = isCloudinary(src)
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      loader={cld ? cloudinaryLoader : undefined}
      unoptimized={!cld}
      draggable={false}
    />
  )
}
