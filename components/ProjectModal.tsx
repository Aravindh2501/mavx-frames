'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { CloseIcon, PlusIcon, TrashIcon } from './Icons'
import { api } from '@/lib/client'
import { thumbUrl } from '@/lib/cloudinary'
import { uploadMedia } from '@/lib/upload'
import { CATEGORIES, SHAPES } from '@/lib/types'
import type { Project, Reel, Shape } from '@/lib/types'

interface Draft {
  title: string
  category: string
  location: string
  description: string
  shape: Shape
  cover: string
  photos: string[]
  reels: Reel[]
}

interface Upload {
  id: string
  name: string
  progress: number
  error?: string
}

const emptyDraft = (): Draft => ({
  title: '',
  category: CATEGORIES[0],
  location: '',
  description: '',
  shape: 'tall',
  cover: '',
  photos: [],
  reels: []
})

const fromProject = (p: Project): Draft => ({
  title: p.title,
  category: p.category,
  location: p.location,
  description: p.description,
  shape: p.shape,
  cover: p.cover,
  photos: p.photos,
  reels: p.reels
})

interface Props {
  open: boolean
  project: Project | null
  onClose: () => void
  onSaved: () => void
  onDeleted: () => void
}

export default function ProjectModal({ open, project, onClose, onSaved, onDeleted }: Props) {
  const panel = useRef<HTMLDivElement>(null)
  const coverInput = useRef<HTMLInputElement>(null)
  const mediaInput = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState<Draft>(emptyDraft())
  const [uploads, setUploads] = useState<Upload[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setDraft(project ? fromProject(project) : emptyDraft())
    setUploads([])
    setError('')
  }, [open, project])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useGSAP(
    () => {
      if (open && panel.current) {
        gsap.fromTo(
          panel.current,
          { y: 48, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }
        )
      }
    },
    { dependencies: [open] }
  )

  if (!open) return null

  const busy = uploads.some((u) => !u.error)

  const runUploads = async (files: File[], mode: 'cover' | 'media') => {
    const queue = files.filter((f) =>
      mode === 'cover' ? f.type.startsWith('image/') : /^(image|video)\//.test(f.type)
    )
    const worker = async () => {
      for (;;) {
        const file = queue.shift()
        if (!file) return
        const id = crypto.randomUUID()
        setUploads((u) => [...u, { id, name: file.name, progress: 0 }])
        try {
          const res = await uploadMedia(file, (progress) =>
            setUploads((u) => u.map((x) => (x.id === id ? { ...x, progress } : x)))
          )
          if (res.kind === 'video') {
            setDraft((d) => ({ ...d, reels: [...d.reels, { src: res.url, poster: res.poster }] }))
          } else if (mode === 'cover') {
            setDraft((d) => ({
              ...d,
              cover: res.url,
              photos: d.photos.includes(res.url) ? d.photos : [res.url, ...d.photos]
            }))
          } else {
            setDraft((d) => ({
              ...d,
              photos: [...d.photos, res.url],
              cover: d.cover || res.url
            }))
          }
          setUploads((u) => u.filter((x) => x.id !== id))
        } catch (err) {
          setUploads((u) =>
            u.map((x) => (x.id === id ? { ...x, error: (err as Error).message } : x))
          )
        }
      }
    }
    await Promise.all([worker(), worker(), worker()])
  }

  const removePhoto = (src: string) =>
    setDraft((d) => {
      const photos = d.photos.filter((p) => p !== src)
      return { ...d, photos, cover: d.cover === src ? photos[0] ?? '' : d.cover }
    })

  const removeReel = (src: string) =>
    setDraft((d) => ({ ...d, reels: d.reels.filter((r) => r.src !== src) }))

  const save = async () => {
    setError('')
    if (!draft.title.trim()) return setError('Please add a project title')
    if (!draft.cover && !draft.photos[0]) return setError('Please add at least one photo')
    setSaving(true)
    try {
      const body = { ...draft, cover: draft.cover || draft.photos[0] }
      if (project) await api(`/api/projects/${project.id}`, { method: 'PUT', body })
      else await api('/api/projects', { method: 'POST', body })
      onSaved()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!project) return
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    setSaving(true)
    try {
      await api(`/api/projects/${project.id}`, { method: 'DELETE' })
      onDeleted()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-black/60 backdrop-blur-sm md:items-center md:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panel}
        className="max-h-[94svh] w-full max-w-5xl overflow-y-auto rounded-t-2xl bg-paper p-6 shadow-2xl md:rounded-2xl md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl">{project ? 'Edit project' : 'New project'}</h2>
          <button onClick={onClose} aria-label="Close" className="text-mute hover:text-ink">
            <CloseIcon />
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-4">
            <div>
              <label className="label">Project title</label>
              <input
                className="field"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Project type</label>
                <select
                  className="field"
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                >
                  {Array.from(new Set([...CATEGORIES, draft.category])).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Location</label>
                <input
                  className="field"
                  value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="label">Shape in the “In Focus” scroll</label>
              <select
                className="field"
                value={draft.shape}
                onChange={(e) => setDraft({ ...draft, shape: e.target.value as Shape })}
              >
                {SHAPES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                className="field min-h-[120px] resize-y"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <label className="label">Cover image</label>
              <div className="flex items-center gap-3">
                <div className="h-16 w-24 overflow-hidden rounded bg-line">
                  {draft.cover && (
                    <img
                      src={thumbUrl(draft.cover, 300)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <button type="button" onClick={() => coverInput.current?.click()} className="btn-ghost">
                  Change image
                </button>
                <input
                  ref={coverInput}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    if (e.target.files) runUploads(Array.from(e.target.files), 'cover')
                    e.target.value = ''
                  }}
                />
              </div>
            </div>

            <div>
              <label className="label">
                Photos <span className="text-mute/70">· click one to make it the cover</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {draft.photos.map((src) => (
                  <div key={src} className="group relative h-16 w-16">
                    <button
                      type="button"
                      onClick={() => setDraft({ ...draft, cover: src })}
                      className={`h-full w-full overflow-hidden rounded ${
                        draft.cover === src ? 'ring-2 ring-ink ring-offset-1' : ''
                      }`}
                    >
                      <img src={thumbUrl(src)} alt="" className="h-full w-full object-cover" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePhoto(src)}
                      aria-label="Remove photo"
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-line bg-paper text-ink shadow"
                    >
                      <CloseIcon width={11} height={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Reels</label>
              <div className="flex flex-wrap gap-2">
                {draft.reels.map((r) => (
                  <div key={r.src} className="relative h-24 w-14">
                    <div className="h-full w-full overflow-hidden rounded bg-ink/10">
                      {r.poster ? (
                        <img src={r.poster} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <video src={r.src} muted className="h-full w-full object-cover" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeReel(r.src)}
                      aria-label="Remove reel"
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-line bg-paper text-ink shadow"
                    >
                      <CloseIcon width={11} height={11} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => mediaInput.current?.click()}
                  className="flex h-24 min-w-[140px] flex-1 flex-col items-center justify-center gap-1 rounded border border-dashed border-mute/50 text-xs text-mute transition-colors hover:border-ink hover:text-accent"
                >
                  <PlusIcon />
                  Add photos or reels
                </button>
                <input
                  ref={mediaInput}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  hidden
                  onChange={(e) => {
                    if (e.target.files) runUploads(Array.from(e.target.files), 'media')
                    e.target.value = ''
                  }}
                />
              </div>
            </div>

            {uploads.length > 0 && (
              <ul className="flex flex-col gap-2">
                {uploads.map((u) => (
                  <li key={u.id} className="text-xs">
                    <div className="flex justify-between text-mute">
                      <span className="truncate pr-3">{u.name}</span>
                      <span className={u.error ? 'text-accent' : ''}>
                        {u.error ?? `${u.progress}%`}
                      </span>
                    </div>
                    {!u.error && (
                      <div className="mt-1 h-0.5 bg-line">
                        <div className="h-full bg-ink transition-all" style={{ width: `${u.progress}%` }} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {error && <p className="mt-5 text-sm text-accent">{error}</p>}

        <div className="mt-8 flex items-center justify-between">
          {project ? (
            <button
              type="button"
              onClick={remove}
              disabled={saving}
              className="flex items-center gap-2 text-sm text-accent hover:underline"
            >
              <TrashIcon width={16} height={16} /> Delete project
            </button>
          ) : (
            <span />
          )}
          <button type="button" onClick={save} disabled={saving || busy} className="btn-solid">
            {saving ? 'Saving…' : busy ? 'Uploading…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
