import { WEDDINGS_ENABLED } from './focus'

// Public business details only. Never put secret keys in NEXT_PUBLIC variables.
const profile = (value: string | undefined) => {
  if (!value) return ''
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.pathname !== '/' ? url.href : ''
  } catch { return '' }
}
const publicEmail = (process.env.NEXT_PUBLIC_CONTACT_EMAIL || '').trim()
export const site = {
  name: 'MAVX Frames',
  city: 'Chennai & Coimbatore',
  instagram: profile(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  youtube: profile(process.env.NEXT_PUBLIC_YOUTUBE_URL),
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(publicEmail) ? `mailto:${publicEmail}` : '',
  phone: (process.env.NEXT_PUBLIC_CONTACT_PHONE || '').trim(),
  aboutImage: '/images/the-hands-that-hold.png',
  contactImage: '/images/threads-of-gold.png',
  aboutHeading: ['Good light.', 'Real connection.', 'Your story.'],
  aboutText: WEDDINGS_ENABLED
    ? 'I’m Aravindh, the founder of MAVX Frames. Based in Chennai and Coimbatore, we photograph weddings, people and brands across Tamil Nadu. I look for the small gestures and honest expressions that make a frame feel like you.'
    : 'I’m Aravindh, the founder of MAVX Frames. Based in Chennai and Coimbatore, we photograph portraits, fashion, reels and brands across Tamil Nadu. I look for the small gestures and honest expressions that make a frame feel like you.',
  shootTypes: WEDDINGS_ENABLED
    ? ['Wedding', 'Pre-wedding', 'Engagement', 'Portrait', 'Maternity', 'Event', 'Commercial', 'Fashion', 'Video / Reels', 'Other']
    : ['Portrait', 'Fashion', 'Video / Reels', 'Product / Commercial', 'Birthday', 'Other']
}
