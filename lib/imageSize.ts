import { promises as fs } from 'fs'
import path from 'path'
import { isCloudinary } from './cloudinary'

const known = new Map<string, number>()
const PUBLIC_DIR = path.join(process.cwd(), 'public')
const HEAD_BYTES = 262144

type Size = { w: number; h: number }

const exifOrientation = (t: Buffer) => {
  const little = t.toString('latin1', 0, 2) === 'II'
  const r16 = (o: number) => (little ? t.readUInt16LE(o) : t.readUInt16BE(o))
  const r32 = (o: number) => (little ? t.readUInt32LE(o) : t.readUInt32BE(o))
  const ifd = r32(4)
  const count = r16(ifd)
  for (let i = 0; i < count; i++) {
    const entry = ifd + 2 + i * 12
    if (r16(entry) === 0x0112) return r16(entry + 8)
  }
  return 1
}

const pngSize = (b: Buffer): Size | null =>
  b.length >= 24 && b.readUInt32BE(0) === 0x89504e47 ? { w: b.readUInt32BE(16), h: b.readUInt32BE(20) } : null

const webpSize = (b: Buffer): Size | null => {
  if (b.length < 30 || b.toString('latin1', 0, 4) !== 'RIFF' || b.toString('latin1', 8, 12) !== 'WEBP') return null
  const kind = b.toString('latin1', 12, 16)
  if (kind === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff }
  if (kind === 'VP8L') {
    return {
      w: 1 + (((b[22] & 0x3f) << 8) | b[21]),
      h: 1 + (((b[24] & 0x0f) << 10) | (b[23] << 2) | ((b[22] & 0xc0) >> 6))
    }
  }
  if (kind === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) }
  return null
}

const jpegSize = (b: Buffer): Size | null => {
  if (b[0] !== 0xff || b[1] !== 0xd8) return null
  let offset = 2
  let orientation = 1
  while (offset + 9 < b.length) {
    if (b[offset] !== 0xff) {
      offset += 1
      continue
    }
    const marker = b[offset + 1]
    if (marker === 0xff) {
      offset += 1
      continue
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2
      continue
    }
    const length = b.readUInt16BE(offset + 2)
    if (marker === 0xe1 && b.toString('latin1', offset + 4, offset + 8) === 'Exif') {
      orientation = exifOrientation(b.subarray(offset + 10, offset + 2 + length))
    }
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      const h = b.readUInt16BE(offset + 5)
      const w = b.readUInt16BE(offset + 7)
      return orientation >= 5 && orientation <= 8 ? { w: h, h: w } : { w, h }
    }
    offset += 2 + length
  }
  return null
}

const sizeOf = (b: Buffer) => pngSize(b) ?? jpegSize(b) ?? webpSize(b)

const readLocal = async (src: string) => {
  const file = path.resolve(PUBLIC_DIR, `.${decodeURIComponent(src.split('?')[0])}`)
  if (!file.startsWith(PUBLIC_DIR + path.sep)) return null
  const handle = await fs.open(file, 'r')
  try {
    const buffer = Buffer.alloc(HEAD_BYTES)
    const { bytesRead } = await handle.read(buffer, 0, HEAD_BYTES, 0)
    return buffer.subarray(0, bytesRead)
  } finally {
    await handle.close()
  }
}

const readCloudinary = async (src: string) => {
  const url = src.replace('/image/upload/', '/image/upload/c_limit,w_64,f_png/')
  const res = await fetch(url, { signal: AbortSignal.timeout(2000) })
  return res.ok ? Buffer.from(await res.arrayBuffer()) : null
}

const ratioFor = async (src: string) => {
  const hit = known.get(src)
  if (hit) return hit
  try {
    const buffer = src.startsWith('/') ? await readLocal(src) : isCloudinary(src) ? await readCloudinary(src) : null
    const size = buffer ? sizeOf(buffer) : null
    if (!size || !size.w || !size.h) return null
    const ratio = size.w / size.h
    known.set(src, ratio)
    return ratio
  } catch {
    return null
  }
}

export async function getImageRatios(srcs: string[]) {
  const out: Record<string, number> = {}
  await Promise.all(
    Array.from(new Set(srcs.filter(Boolean))).map(async (src) => {
      const ratio = await ratioFor(src)
      if (ratio) out[src] = ratio
    })
  )
  return out
}
