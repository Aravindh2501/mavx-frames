import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { db, hasDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

const clean = (v: unknown, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/

type Entry = { name: string; contact: string; type: string; message: string; at: string }

async function sendWithResend(entry: Entry): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY
  const to = (process.env.ENQUIRY_TO_EMAIL || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (!key || !to.length) {
    return { ok: false, error: 'RESEND_API_KEY or ENQUIRY_TO_EMAIL is not set' }
  }

  const from = process.env.RESEND_FROM || 'MAVX Frames <onboarding@resend.dev>'
  const subject = `New enquiry from ${entry.name}${entry.type ? ` — ${entry.type}` : ''}`
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#111">
      <h2 style="margin:0 0 12px">New website enquiry</h2>
      <p><b>Name:</b> ${esc(entry.name)}</p>
      <p><b>Contact:</b> ${esc(entry.contact)}</p>
      <p><b>Shoot type:</b> ${esc(entry.type || '—')}</p>
      <p><b>Message:</b><br>${esc(entry.message || '—').replace(/\n/g, '<br>')}</p>
      <p style="color:#888;font-size:12px">Received ${esc(entry.at)}</p>
    </div>`
  const textBody = `New website enquiry\n\nName: ${entry.name}\nContact: ${entry.contact}\nShoot type: ${
    entry.type || '-'
  }\n\nMessage:\n${entry.message || '-'}\n\nReceived ${entry.at}`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        text: textBody,
        ...(EMAIL.test(entry.contact) ? { reply_to: entry.contact } : {})
      })
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      const msg = data?.message ?? `Resend responded ${res.status}`
      console.error('[enquiry] Resend error:', msg)
      return { ok: false, error: msg }
    }
    return { ok: true }
  } catch (err) {
    console.error('[enquiry] Resend request failed', err)
    return { ok: false, error: 'Could not reach Resend' }
  }
}

async function storeEntry(entry: Entry): Promise<boolean> {
  try {
    if (hasDb()) {
      const c = await db()
      await c.execute({
        sql: 'INSERT INTO enquiries (name, contact, type, message, at) VALUES (?, ?, ?, ?, ?)',
        args: [entry.name, entry.contact, entry.type, entry.message, entry.at]
      })
      return true
    }
    const file = path.join(process.cwd(), 'data', 'enquiries.json')
    await fs.mkdir(path.dirname(file), { recursive: true })
    let list: unknown[] = []
    try {
      list = JSON.parse(await fs.readFile(file, 'utf8'))
    } catch {
      list = []
    }
    list.unshift(entry)
    await fs.writeFile(file, JSON.stringify(list, null, 2))
    return true
  } catch (err) {
    console.error('[enquiry] storage failed', err)
    return false
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const entry: Entry = {
    name: clean(body.name, 100),
    contact: clean(body.contact, 120),
    type: clean(body.type, 40),
    message: clean(body.message, 2000),
    at: new Date().toISOString()
  }
  if (!entry.name || !entry.contact) {
    return NextResponse.json({ error: 'Name and contact are required' }, { status: 400 })
  }

  const hook = process.env.ENQUIRY_WEBHOOK_URL
  const [mail, stored, hooked] = await Promise.all([
    sendWithResend(entry),
    storeEntry(entry),
    hook
      ? fetch(hook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        })
          .then((r) => r.ok)
          .catch(() => false)
      : Promise.resolve(false)
  ])

  if (mail.ok || stored || hooked) return NextResponse.json({ ok: true, emailed: mail.ok })

  return NextResponse.json(
    { error: 'Could not send your enquiry right now. Please try again or contact us directly.' },
    { status: 502 }
  )
}
