'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CloseIcon } from './Icons'
import { site } from '@/lib/site'

gsap.registerPlugin(useGSAP)

type Status = 'idle' | 'sending' | 'done' | 'error'

export default function ContactModal({
  open,
  onClose
}: {
  open: boolean
  onClose: () => void
}) {
  const panel = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState({ name: '', contact: '', type: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

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
          { y: 40, autoAlpha: 0, scale: 0.98 },
          { y: 0, autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
        )
      }
    },
    { dependencies: [open] }
  )

  if (!open) return null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Something went wrong')
      }
      setStatus('done')
      setForm({ name: '', contact: '', type: '', message: '' })
    } catch (err) {
      setError((err as Error).message)
      setStatus('error')
    }
  }

  const close = () => {
    setStatus('idle')
    onClose()
  }

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        ref={panel}
        className="grid w-full max-w-3xl overflow-hidden rounded-lg bg-paper shadow-2xl md:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="relative hidden min-h-[420px] md:block">
          <img
            src={site.contactImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="relative p-7 md:p-9">
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 text-mute transition-colors hover:text-ink"
          >
            <CloseIcon />
          </button>

          {status === 'done' ? (
            <div className="flex h-full min-h-[320px] flex-col justify-center">
              <h2 className="font-serif text-3xl">Thank you.</h2>
              <p className="mt-3 text-sm text-mute">
                Your note has reached me. I’ll get back to you very soon.
              </p>
              <button onClick={close} className="btn-ghost mt-6 self-start">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3">
              <h2 className="font-serif text-3xl leading-tight">Let’s make something real.</h2>
              <p className="mb-2 text-xs text-mute">
                Tell me a bit about your plans and I’ll get back to you soon.
              </p>
              <input
                required
                className="field"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                required
                className="field"
                placeholder="Email or phone"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />
              <select
                className="field"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="">Shoot type</option>
                {site.shootTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <textarea
                className="field min-h-[110px] resize-y"
                placeholder="Tell me about your idea"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              {error && <p className="text-xs text-accent">{error}</p>}
              <button type="submit" disabled={status === 'sending'} className="btn-solid self-start">
                {status === 'sending' ? 'Sending…' : 'Send enquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
