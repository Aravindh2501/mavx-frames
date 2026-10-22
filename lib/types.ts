import { WEDDINGS_ENABLED } from './focus'

export type Shape =
  | 'tall'
  | 'wide'
  | 'arch'
  | 'square'
  | 'circle'
  | 'pill'
  | 'slant'
  | 'triangle'

export interface Reel {
  src: string
  poster?: string
}

export interface Project {
  id: string
  slug: string
  title: string
  category: string
  location: string
  description: string
  cover: string
  photos: string[]
  reels: Reel[]
  shape: Shape
  createdAt: string
}

export type ProjectInput = Omit<Project, 'id' | 'slug' | 'createdAt'>

const WEDDING_CATEGORIES = [
  'Weddings',
  'Pre-wedding',
  'Engagement',
  'Portraits',
  'Maternity',
  'Events',
  'Commercial',
  'Fashion',
  'Details'
]

const SOLO_CATEGORIES = ['Portraits', 'Fashion', 'Reels', 'Birthdays', 'Commercial', 'Events', 'Details']

export const CATEGORIES = WEDDINGS_ENABLED ? WEDDING_CATEGORIES : SOLO_CATEGORIES

export const SHAPES: { value: Shape; label: string }[] = [
  { value: 'tall', label: 'Vertical rectangle' },
  { value: 'wide', label: 'Horizontal rectangle' },
  { value: 'square', label: 'Square' },
  { value: 'arch', label: 'Arch' },
  { value: 'circle', label: 'Circle' },
  { value: 'pill', label: 'Pill' },
  { value: 'slant', label: 'Slanted' },
  { value: 'triangle', label: 'Triangle' }
]

export const SHAPE_VALUES = SHAPES.map((s) => s.value)
