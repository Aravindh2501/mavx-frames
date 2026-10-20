import { promises as fs } from 'fs'
import path from 'path'
import { defaultProjects } from './defaultProjects'
import { SHAPE_VALUES } from './types'
import type { Project, ProjectInput, Reel, Shape } from './types'

const file = path.join(process.cwd(), 'data', 'projects.json')

async function ensure() {
  try {
    await fs.access(file)
  } catch {
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, JSON.stringify(defaultProjects, null, 2))
  }
}

async function save(list: Project[]) {
  await ensure()
  await fs.writeFile(file, JSON.stringify(list, null, 2))
}

export async function getProjects(): Promise<Project[]> {
  try {
    await ensure()
    return JSON.parse(await fs.readFile(file, 'utf8')) as Project[]
  } catch {
    return defaultProjects
  }
}

export async function getProject(slug: string) {
  const list = await getProjects()
  return list.find((p) => p.slug === slug) ?? null
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'story'

const isUrl = (v: unknown): v is string =>
  typeof v === 'string' && /^https?:\/\//.test(v)

const text = (v: unknown, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

export function sanitize(body: unknown): ProjectInput | null {
  if (!body || typeof body !== 'object') return null
  const b = body as Record<string, unknown>
  const title = text(b.title, 120)
  if (!title) return null
  const photos = Array.isArray(b.photos) ? b.photos.filter(isUrl) : []
  const reels: Reel[] = Array.isArray(b.reels)
    ? b.reels
        .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
        .filter((r) => isUrl(r.src))
        .map((r) => ({
          src: r.src as string,
          poster: isUrl(r.poster) ? (r.poster as string) : undefined
        }))
    : []
  const cover = isUrl(b.cover) ? b.cover : photos[0] ?? ''
  if (!cover) return null
  const shape = SHAPE_VALUES.includes(b.shape as Shape) ? (b.shape as Shape) : 'tall'
  return {
    title,
    category: text(b.category, 40) || 'Weddings',
    location: text(b.location, 80),
    description: text(b.description, 600),
    cover,
    photos,
    reels,
    shape
  }
}

export async function createProject(input: ProjectInput) {
  const list = await getProjects()
  const base = slugify(input.title)
  let slug = base
  let n = 2
  while (list.some((p) => p.slug === slug)) slug = `${base}-${n++}`
  const project: Project = {
    ...input,
    id: crypto.randomUUID(),
    slug,
    createdAt: new Date().toISOString()
  }
  await save([project, ...list])
  return project
}

export async function updateProject(id: string, input: ProjectInput) {
  const list = await getProjects()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) return null
  const next = { ...list[idx], ...input }
  list[idx] = next
  await save(list)
  return next
}

export async function deleteProject(id: string) {
  const list = await getProjects()
  const next = list.filter((p) => p.id !== id)
  if (next.length === list.length) return false
  await save(next)
  return true
}
