// 一次性脚本：把 JetBrains Mono / Archivo 的 Latin 子集（可变字体，一份覆盖整个字重轴）
// 下载到 public/fonts。字体文件已提交到仓库；只有换字体时才需要重跑：
//   npm run fonts
// CSS（src/styles/fonts.css）由 scripts/gen-fonts-css.mjs 在 predev / prebuild 生成。
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const CSS_URL =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300..500&family=Archivo:wght@400..700&display=swap'
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'

const TARGETS = [
  { family: 'Archivo', prefix: 'archivo' },
  { family: 'JetBrains Mono', prefix: 'jetbrains-mono' },
]

const fontsDir = join(process.cwd(), 'public', 'fonts')
const css = await fetch(CSS_URL, { headers: { 'User-Agent': UA } }).then((res) => res.text())

// 只取 latin 子集：Google 对可变字重的请求会返回一行 `font-weight: 400 700`
const re = /\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g
const found = new Map()
let match
while ((match = re.exec(css))) {
  const [, subset, body] = match
  if (subset !== 'latin') continue
  const family = /font-family:\s*'([^']+)'/.exec(body)?.[1]
  const range = /font-weight:\s*([\d ]+);/.exec(body)?.[1]?.trim()
  const url = /url\((https:[^)]+)\)/.exec(body)?.[1]
  if (family && url) found.set(family, { weight: range ?? '400', url })
}

await mkdir(fontsDir, { recursive: true })

for (const { family, prefix } of TARGETS) {
  const entry = found.get(family)
  if (!entry) throw new Error(`CSS 里没有 ${family} 的 latin 段`)
  const res = await fetch(entry.url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${family}: HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const file = join(fontsDir, `${prefix}.woff2`)
  await writeFile(file, buf)
  console.log(`${prefix}.woff2  weight ${entry.weight}  ${(buf.length / 1024).toFixed(1)} KB`)
}
