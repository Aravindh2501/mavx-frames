'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { CloseIcon, InstagramIcon, MailIcon, PhoneIcon } from './Icons'
import { site } from '@/lib/site'

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

  const phoneHref = site.phone ? `tel:${site.phone.replace(/[^+\d]/g, '')}` : ''

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
      role="dialog"
      aria-modal="true"
      aria-label="Contact"
      className="fixed inset-0 z-[100] flex overflow-y-auto overscroll-contain bg-black/60 p-3 backdrop-blur-sm sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        ref={panel}
        className="m-auto grid w-full max-w-3xl overflow-hidden rounded-lg bg-paper shadow-2xl md:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="relative hidden min-h-[420px] md:block">
          <img
            src={site.contactImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="relative p-5 sm:p-7 md:p-9">
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center text-mute transition-colors hover:text-ink sm:right-3 sm:top-3"
          >
            <CloseIcon />
          </button>

          {status === 'done' ? (
            <div className="flex h-full min-h-[280px] flex-col justify-center sm:min-h-[320px]">
              <h2 className="font-serif text-3xl">Thank you.</h2>
              <p className="mt-3 text-sm text-mute">
                Your enquiry has been received. We’ll contact you to discuss your shoot.
              </p>
              <button onClick={close} className="btn-ghost mt-6 min-h-[44px] self-start">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3">
              <h2 className="pr-10 font-serif text-2xl leading-tight sm:text-3xl">
                Tell us what you’re planning.
              </h2>
              <p className="mb-2 text-xs text-mute">
                Share your date, venue and ideas. We’ll take it from there.
              </p>
              <input
                required
                className="field"
                placeholder="Your name"
                aria-label="Your name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                required
                className="field"
                placeholder="Email or phone"
                aria-label="Email or phone"
                autoComplete="email"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />
              <select
                aria-label="Shoot type"
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
                placeholder="Shoot date, city, venue and what you have in mind"
                aria-label="Shoot date, venue and requirements"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              {error && <p className="text-xs text-accent">{error}</p>}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-filled mt-1 min-h-[48px] w-full sm:w-auto sm:self-start"
              >
                {status === 'sending' ? 'Sending…' : 'Send enquiry'}
              </button>
              {(phoneHref || site.email || site.instagram) && (
                <ul className="mt-3 flex flex-col gap-2 border-t border-line pt-4 text-sm text-ink/80">
                  {phoneHref && (
                    <li>
                      <a href={phoneHref} className="inline-flex items-center gap-2.5 transition-colors hover:text-accent">
                        <PhoneIcon width={16} height={16} />
                        {site.phone}
                      </a>
                    </li>
                  )}
                  {site.email && (
                    <li>
                      <a href={site.email} className="inline-flex items-center gap-2.5 break-all transition-colors hover:text-accent">
                        <MailIcon width={16} height={16} />
                        {site.email.replace('mailto:', '')}
                      </a>
                    </li>
                  )}
                  {site.instagram && (
                    <li>
                      <a
                        href={site.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 transition-colors hover:text-accent"
                      >
                        <InstagramIcon width={16} height={16} />
                        Instagram
                      </a>
                    </li>
                  )}
                </ul>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}