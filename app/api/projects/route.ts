import { NextResponse } from 'next/server'
import { authorized } from '@/lib/auth'
import { createProject, getProjects, sanitize } from '@/lib/store'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(await getProjects())
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const input = sanitize(await req.json().catch(() => null))
  if (!input) {
    return NextResponse.json(
      { error: 'A title and at least one photo are required' },
      { status: 400 }
    )
  }
  try {
    return NextResponse.json(await createProject(input), { status: 201 })
  } catch (err) {
    console.error('[projects] save failed', err)
    return NextResponse.json(
      { error: `Could not save: ${(err as Error).message}` },
      { status: 500 }
    )
  }
}
