import { ImageResponse } from 'next/og'
export const alt = 'MAVX Frames — Photography and films in Chennai and Coimbatore'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default function Image() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '70px', background: '#241018', color: '#fff5ef' }}>
      <div style={{ display: 'flex', fontSize: 28, letterSpacing: '6px' }}>MAVX FRAMES</div>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 88, lineHeight: 1.05, letterSpacing: '-4px' }}><div>Your story.</div><div style={{ color: '#e3a8b5' }}>Every frame.</div></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 25 }}><div>Photography &amp; films</div><div style={{ color: '#d4b9c1', fontSize: 22 }}>Chennai + Coimbatore · Across Tamil Nadu</div></div>
    </div>, size
  )
}
