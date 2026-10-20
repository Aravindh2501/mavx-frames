import { NextResponse } from 'next/server'
import { authorized } from '@/lib/auth'
import { deleteProject, sanitize, updateProject } from '@/lib/store'

export const dynamic = 'force-dynamic'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: Request, { params }: Ctx) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const input = sanitize(await req.json().catch(() => null))
  if (!input) {
    return NextResponse.json(
      { error: 'A title and at least one photo are required' },
      { status: 400 }
    )
  }
  try {
    const project = await updateProject(id, input)
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(project)
  } catch (err) {
    console.error('[projects] save failed', err)
    return NextResponse.json(
      { error: `Could not save: ${(err as Error).message}` },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  try {
    const ok = await deleteProject(id)
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[projects] delete failed', err)
    return NextResponse.json(
      { error: `Could not delete: ${(err as Error).message}` },
      { status: 500 }
    )
  }
}
