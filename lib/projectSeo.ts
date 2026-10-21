import type { Project } from './types'
const samples = new Set(['a-love-quietly-told','in-her-own-light','threads-of-gold','the-hands-that-hold','evening-softly','beneath-the-marigolds','before-the-vows','little-lanterns','waiting-for-you','brew-and-brass','city-in-silk'].map(s => `/images/${s}.png`))
export const isConcept = (p: Project) => [p.cover, ...p.photos].some(src => samples.has(src))
export const projectAlt = (p: Project, n?: number) => `${p.title} — ${p.category.toLowerCase()}${isConcept(p) ? ' concept (AI-generated)' : p.location ? ` in ${p.location}` : ''}${n ? `, image ${n}` : ''}`
