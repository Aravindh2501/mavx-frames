import type { Project, Reel, Shape } from './types'

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

const clips = [
  'https://res.cloudinary.com/demo/video/upload/dog.mp4',
  'https://res.cloudinary.com/demo/video/upload/elephants.mp4',
  'https://res.cloudinary.com/demo/video/upload/sea-turtle.mp4'
]

const sizes: [number, number][] = [
  [1600, 1000],
  [1000, 1400],
  [1200, 1200],
  [1400, 1000],
  [1000, 1300],
  [1600, 900]
]

const make = (
  slug: string,
  title: string,
  category: string,
  location: string,
  description: string,
  shape: Shape,
  photoCount: number,
  reelCount: number,
  day: number
): Project => ({
  id: `default-${slug}`,
  slug,
  title,
  category,
  location,
  description,
  shape,
  cover: img(`${slug}-cover`, 1800, 1200),
  photos: Array.from({ length: photoCount }, (_, i) => {
    const [w, h] = sizes[i % sizes.length]
    return img(`${slug}-${i}`, w, h)
  }),
  reels: Array.from(
    { length: reelCount },
    (_, i): Reel => ({
      src: clips[i % clips.length],
      poster: img(`${slug}-reel-${i}`, 720, 1280)
    })
  ),
  createdAt: new Date(Date.UTC(2026, 8, day)).toISOString()
})

export const defaultProjects: Project[] = [
  make(
    'a-love-quietly-told',
    'A love, quietly told.',
    'Weddings',
    'Chennai',
    'A celebration of the little glances, the quiet promises, and everything in between.',
    'wide',
    6,
    3,
    28
  ),
  make(
    'in-her-own-light',
    'In her own light',
    'Portraits',
    'Chennai',
    'A quiet portrait session built around soft afternoon light and unhurried conversation.',
    'tall',
    5,
    2,
    26
  ),
  make(
    'threads-of-gold',
    'Threads of gold',
    'Weddings',
    'Madurai',
    'Silk, jasmine and temple stone — a morning wedding told through texture and tradition.',
    'arch',
    6,
    2,
    24
  ),
  make(
    'the-hands-that-hold',
    'The hands that hold',
    'Details',
    'Kanchipuram',
    'Bangles, henna and borrowed heirlooms, photographed up close.',
    'square',
    4,
    1,
    22
  ),
  make(
    'evening-softly',
    'Evening, softly',
    'Pre-wedding',
    'Pondicherry',
    'Two people, a seaside promenade and the last hour of golden light.',
    'circle',
    5,
    2,
    20
  ),
  make(
    'beneath-the-marigolds',
    'Beneath the marigolds',
    'Engagement',
    'Coimbatore',
    'An intimate engagement under strings of marigold and a lot of laughter.',
    'slant',
    5,
    1,
    18
  ),
  make(
    'before-the-vows',
    'Before the vows',
    'Weddings',
    'Mahabalipuram',
    'The stillness just before the ceremony begins.',
    'pill',
    5,
    2,
    16
  ),
  make(
    'little-lanterns',
    'Little lanterns',
    'Events',
    'Chennai',
    'A festival evening of lamps, music and family, caught candidly.',
    'triangle',
    4,
    1,
    14
  ),
  make(
    'waiting-for-you',
    'Waiting for you',
    'Maternity',
    'Chennai',
    'A gentle maternity story shot at home in warm window light.',
    'arch',
    5,
    1,
    12
  ),
  make(
    'brew-and-brass',
    'Brew and brass',
    'Commercial',
    'Chennai',
    'Brand photography for a neighbourhood coffee roaster.',
    'wide',
    6,
    1,
    10
  ),
  make(
    'city-in-silk',
    'City in silk',
    'Fashion',
    'Chennai',
    'A handloom editorial shot across the old streets of Mylapore.',
    'tall',
    6,
    2,
    8
  )
]
