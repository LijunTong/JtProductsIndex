// 构建后自检：把所有站内链接落到 dist 里的真实文件上。
// 用法：npm run build && npm run check:links
import { readdir, readFile, access } from 'node:fs/promises'
import { join, relative } from 'node:path'

const ROOT = 'dist'
const BASE = (process.env.BASE_PATH ?? '/').replace(/\/$/, '')

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(full)))
    else if (entry.name.endsWith('.html')) files.push(full)
  }
  return files
}

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

function candidates(urlPath) {
  const path = urlPath === '/' ? '/index.html' : urlPath
  if (path.endsWith('/')) return [join(ROOT, path + 'index.html')]
  if (/\.[a-z0-9]+$/i.test(path)) return [join(ROOT, path)]
  return [join(ROOT, path + '/index.html'), join(ROOT, path + '.html')]
}

const files = await walk(ROOT)
const broken = []
let checked = 0

for (const file of files) {
  const html = await readFile(file, 'utf8')
  const urls = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1])
  for (const raw of urls) {
    if (!raw || /^(https?:|mailto:|tel:|data:|#|javascript:)/i.test(raw)) continue
    let url = raw.split('#')[0].split('?')[0]
    if (!url.startsWith('/')) continue // 相对链接目前不用
    if (BASE && url.startsWith(BASE + '/')) url = url.slice(BASE.length)
    else if (BASE && url === BASE) url = '/'
    checked += 1
    const found = await Promise.all(candidates(url).map(exists))
    if (!found.some(Boolean)) {
      broken.push({ page: relative(ROOT, file), url: raw })
    }
  }
}

if (broken.length) {
  console.error(`✗ ${broken.length} 个站内链接指向不存在的文件（共检查 ${checked} 个）`)
  for (const item of broken.slice(0, 40)) console.error(`  ${item.page} → ${item.url}`)
  process.exit(1)
}

console.log(`✓ 站内链接全部有效（${files.length} 个页面，${checked} 个链接）`)
