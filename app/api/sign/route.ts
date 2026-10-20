import { createHash } from 'crypto'
import { NextResponse } from 'next/server'
import { authorized } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: 'Cloudinary is not configured. Add the keys to .env.local' },
      { status: 500 }
    )
  }

  const body = await req.json().catch(() => ({}))
  const kind = body.kind === 'video' ? 'video' : 'image'
  const timestamp = Math.round(Date.now() / 1000)
  const folder = process.env.CLOUDINARY_FOLDER || 'aravindh-portfolio'

  const params: Record<string, string> =
    kind === 'video'
      ? {
          folder,
          format: 'mp4',
          transformation: 'c_limit,h_1920,w_1080,q_auto:good'
        }
      : {
          folder,
          format: 'webp',
          transformation: 'c_limit,h_2400,w_2400,q_auto:best'
        }

  const toSign = Object.entries({ ...params, timestamp })
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&')

  const signature = createHash('sha1').update(toSign + apiSecret).digest('hex')

  return NextResponse.json({ cloudName, apiKey, timestamp, signature, params })
}
