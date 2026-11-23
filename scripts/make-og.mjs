// 一次性工具：生成 public/og.png。需要先临时安装 → npm i -D sharp
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const width = 1200
const height = 630

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="glow" cx="82%" cy="18%" r="70%">
      <stop offset="0%" stop-color="#34D399" stop-opacity="0.22"/>
      <stop offset="55%" stop-color="#0B1015" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0E141B"/>
      <stop offset="100%" stop-color="#0B1015"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>
  <g fill="none" stroke="#FFFFFF" stroke-opacity="0.05">
    ${Array.from({ length: 9 }, (_, i) => `<path d="M${120 + i * 120} 0V${height}"/>`).join('')}
    ${Array.from({ length: 5 }, (_, i) => `<path d="M0 ${110 + i * 110}H${width}"/>`).join('')}
  </g>
  <rect x="96" y="96" width="72" height="72" rx="18" fill="#E8EDF4"/>
  <text x="132" y="146" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#0B1015">JT</text>
  <text x="96" y="360" font-family="Arial, Helvetica, sans-serif" font-size="92" font-weight="700" fill="#E8EDF4" letter-spacing="-3">JT TOOLS</text>
  <text x="98" y="416" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#93A1B3">Local-first desktop apps for your own machine</text>
  <rect x="96" y="470" width="120" height="4" rx="2" fill="#34D399"/>
</svg>`

await mkdir('public', { recursive: true })
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og.png')
console.log('public/og.png written')
