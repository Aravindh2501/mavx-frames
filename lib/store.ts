import { promises as fs } from 'fs'
import path from 'path'
import { defaultProjects } from './defaultProjects'
import { db, hasDb } from './db'
import { SHAPE_VALUES } from './types'
import type { Project, ProjectInput, Reel, Shape } from './types'

const file = path.join(process.cwd(), 'data', 'projects.json')

// Optional one-time seed: data/projects.json may be missing on the server (it is
// usually git-ignored), so it is read at runtime instead of imported at build time.
async function loadSeed(): Promise<Project[]> {
  try {
    const list = JSON.parse(await fs.readFile(file, 'utf8')) as Project[]
    if (Array.isArray(list) && list.length) return list
  } catch {
    // file not present on the server - fall through
  }
  return defaultProjects
}

/* ---------- placeholder clean-up (unchanged behaviour) ---------- */

function normalize(list: Project[]): Project[] {
  return list.map((project) => {
    const sample = defaultProjects.find((p) => p.id === project.id)
    if (!sample) return project
    const placeholder = (url: string) => /^https:\/\/(?:fastly\.)?picsum\.photos\//.test(url)
    return {
      ...project,
      cover: placeholder(project.cover) ? sample.cover : project.cover,
      photos: project.photos.some(placeholder)
        ? [...sample.photos, ...project.photos.filter((url) => !placeholder(url))]
        : project.photos,
      reels: project.reels.filter(
        (reel) =>
          !/^https:\/\/res\.cloudinary\.com\/demo\/video\/upload\/(dog|elephants|sea-turtle)\.mp4$/.test(
            reel.src
          )
      )
    }
  })
}

/* ---------- Turso / libSQL (production) ---------- */

type Row = Record<string, unknown>

const toProject = (r: Row): Project => ({
  id: String(r.id),
  slug: String(r.slug),
  title: String(r.title),
  category: String(r.category ?? ''),
  location: String(r.location ?? ''),
  description: String(r.description ?? ''),
  cover: String(r.cover),
  photos: JSON.parse(String(r.photos || '[]')),
  reels: JSON.parse(String(r.reels || '[]')),
  shape: String(r.shape || 'tall') as Shape,
  createdAt: String(r.created_at)
})

const insertSql = `INSERT OR IGNORE INTO mavx_projects
  (id, slug, title, category, location, description, cover, photos, reels, shape, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

const insertArgs = (p: Project) => [
  p.id,
  p.slug,
  p.title,
  p.category,
  p.location,
  p.description,
  p.cover,
  JSON.stringify(p.photos),
  JSON.stringify(p.reels),
  p.shape,
  p.createdAt
]

async function client() {
  const c = await db()
  // First run only: copy the projects already in data/projects.json into Turso.
  const seeded = await c.execute({ sql: 'SELECT value FROM mavx_meta WHERE key = ?', args: ['projects-seeded'] })
  if (!seeded.rows.length) {
    const count = await c.execute('SELECT COUNT(*) AS n FROM mavx_projects')
    const seed = await loadSeed()
    if (Number((count.rows[0] as unknown as Row).n) === 0 && seed.length) {
      await c.batch(
        seed.map((p) => ({ sql: insertSql, args: insertArgs(p) })),
        'write'
      )
    }
    await c.execute({
      sql: 'INSERT OR REPLACE INTO mavx_meta (key, value) VALUES (?, ?)',
      args: ['projects-seeded', new Date().toISOString()]
    })
  }
  return c
}

/* ---------- local file fallback (dev only, when TURSO_DATABASE_URL is missing) ---------- */

async function ensure() {
  try {
    await fs.access(file)
  } catch {
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, JSON.stringify(defaultProjects, null, 2))
  }
}

async function readFileList(): Promise<Project[]> {
  try {
    await ensure()
    return JSON.parse(await fs.readFile(file, 'utf8')) as Project[]
  } catch {
    return defaultProjects
  }
}

async function saveFileList(list: Project[]) {
  try {
    await ensure()
    await fs.writeFile(file, JSON.stringify(list, null, 2))
  } catch {
    throw new Error(
      'Server storage is read-only. Add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to your environment variables to enable saving.'
    )
  }
}

/* ---------- public API ---------- */

export async function getProjects(): Promise<Project[]> {
  if (hasDb()) {
    try {
      const c = await client()
      const res = await c.execute('SELECT * FROM mavx_projects ORDER BY created_at DESC')
      return normalize(res.rows.map((r) => toProject(r as unknown as Row)))
    } catch (err) {
      console.error('[store] getProjects failed', err)
      return normalize(await loadSeed())
    }
  }
  return normalize(await readFileList())
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
  typeof v === 'string' && (/^https?:\/\//.test(v) || /^\/images\/[a-z0-9][a-z0-9._-]*$/i.test(v))

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
  if (hasDb()) {
    const c = await client()
    await c.execute({ sql: insertSql.replace('INSERT OR IGNORE', 'INSERT'), args: insertArgs(project) })
  } else {
    await saveFileList([project, ...list])
  }
  return project
}

export async function updateProject(id: string, input: ProjectInput) {
  if (hasDb()) {
    const c = await client()
    const found = await c.execute({ sql: 'SELECT * FROM mavx_projects WHERE id = ?', args: [id] })
    if (!found.rows.length) return null
    const next: Project = { ...toProject(found.rows[0] as unknown as Row), ...input }
    await c.execute({
      sql: `UPDATE mavx_projects SET title = ?, category = ?, location = ?, description = ?,
            cover = ?, photos = ?, reels = ?, shape = ? WHERE id = ?`,
      args: [
        next.title,
        next.category,
        next.location,
        next.description,
        next.cover,
        JSON.stringify(next.photos),
        JSON.stringify(next.reels),
        next.shape,
        id
      ]
    })
    return next
  }
  const list = await readFileList()
  const idx = list.findIndex((p) => p.id === id)
  if (idx === -1) return null
  const next = { ...list[idx], ...input }
  list[idx] = next
  await saveFileList(list)
  return next
}

export async function deleteProject(id: string) {
  if (hasDb()) {
    const c = await client()
    const res = await c.execute({ sql: 'DELETE FROM mavx_projects WHERE id = ?', args: [id] })
    return res.rowsAffected > 0
  }
  const list = await readFileList()
  const next = list.filter((p) => p.id !== id)
  if (next.length === list.length) return false
  await saveFileList(next)
  return true
}
