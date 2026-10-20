import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const clean = (v: unknown, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : ''

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const entry = {
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
  if (hook) {
    await fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    }).catch(() => null)
  }

  try {
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
  } catch {
    if (!hook) {
      return NextResponse.json({ error: 'Could not store the enquiry' }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}
