import { api } from './client'
import { videoPoster } from './cloudinary'

interface SignResponse {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  params: Record<string, string>
}

export interface UploadResult {
  kind: 'image' | 'video'
  url: string
  poster?: string
}

const MAX_EDGE = 2400
const WEBP_QUALITY = 0.92

async function toWebp(file: File) {
  if (!/^image\/(jpeg|png|webp|avif|bmp)$/.test(file.type)) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY)
    )
    if (!blob || blob.type !== 'image/webp') return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', {
      type: 'image/webp'
    })
  } catch {
    return file
  }
}

export async function uploadMedia(
  file: File,
  onProgress: (percent: number) => void
): Promise<UploadResult> {
  const kind = file.type.startsWith('video/') ? 'video' : 'image'
  const prepared = kind === 'image' ? await toWebp(file) : file
  const sign = await api<SignResponse>('/api/sign', { method: 'POST', body: { kind } })

  const form = new FormData()
  form.append('file', prepared)
  form.append('api_key', sign.apiKey)
  form.append('timestamp', String(sign.timestamp))
  form.append('signature', sign.signature)
  Object.entries(sign.params).forEach(([k, v]) => form.append(k, v))

  const url = `https://api.cloudinary.com/v1_1/${sign.cloudName}/${kind}/upload`

  const secureUrl = await new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) resolve(data.secure_url)
        else reject(new Error(data?.error?.message ?? 'Upload failed'))
      } catch {
        reject(new Error('Upload failed'))
      }
    }
    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.send(form)
  })

  return {
    kind,
    url: secureUrl,
    poster: kind === 'video' ? videoPoster(secureUrl) : undefined
  }
}
