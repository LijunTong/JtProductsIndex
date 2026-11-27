#!/usr/bin/env node
/**
 * 新建一个项目骨架：
 *
 *   npm run new -- <slug> [--name "中文名"] [--kind desktop|plugin|web|mobile|library|experiment]
 *
 * 生成两份东西：
 *   src/content/projects/<slug>.json   （从 scripts/templates/project.json 复制，替换占位）
 *   src/assets/shots/<slug>/.gitkeep   （截图放这里，文件名写进 JSON）
 *
 * 不做的事：不生成假截图。缺图时 npm run build 会明确告诉你缺哪张。
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const KINDS = ['desktop', 'plugin', 'web', 'mobile', 'library', 'experiment']

const args = process.argv.slice(2)
const flags = new Map()
const positional = []

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i]
  if (arg.startsWith('--')) {
    const key = arg.slice(2)
    const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : 'true'
    flags.set(key, value)
    if (value !== 'true') i += 1
  } else {
    positional.push(arg)
  }
}

const slug = positional[0]

if (!slug) {
  console.error('用法：npm run new -- <slug> [--name "中文名"] [--kind desktop|plugin|web|mobile|library|experiment]')
  process.exit(1)
}

if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error(`slug "${slug}" 不合法：只能用小写字母、数字、连字符，且以字母或数字开头（它会成为网址 /${slug}/）`)
  process.exit(1)
}

const kind = flags.get('kind') ?? 'desktop'
if (!KINDS.includes(kind)) {
  console.error(`--kind 只能是 ${KINDS.join(' / ')}，收到的是 "${kind}"`)
  process.exit(1)
}

const jsonPath = path.join(root, 'src/content/projects', `${slug}.json`)
const shotsDir = path.join(root, 'src/assets/shots', slug)

if (existsSync(jsonPath)) {
  console.error(`src/content/projects/${slug}.json 已经存在，换个 slug，或直接改那个文件`)
  process.exit(1)
}

const name = flags.get('name') ?? '（中文名）'

const template = await readFile(path.join(root, 'scripts/templates/project.json'), 'utf8')
const data = JSON.parse(template)

data.name = name
data.englishName = flags.get('englishName') ?? name
data.kind = kind
data.repo = `https://github.com/LijunTong/${slug}`
data.downloads[0].href = data.repo + '/releases/latest'
data.downloads[0].file = `${slug}-Setup-0.1.0.exe`

if (kind === 'plugin') {
  // 插件没有安装包：换成安装命令（schema 要求 plugin 必须写 install）
  delete data.downloads
  data.cta = { label: '安装方式', href: '#install' }
  data.install = {
    note: '这是一个插件目录：由宿主应用的插件管理器链接安装。',
    command: 'plugin_manager action=install_bundle target=<插件目录绝对路径>',
    steps: ['把这个仓库克隆到本机任意目录', '在插件管理器里指向该目录安装', '在设置里确认它已启用'],
  }
  data.requirements = ['宿主应用（写明版本要求）', '本机已安装 git 并在 PATH 里']
}

await mkdir(path.dirname(jsonPath), { recursive: true })
await writeFile(jsonPath, JSON.stringify(data, null, 2) + '\n')

await mkdir(shotsDir, { recursive: true })
const gitkeep = path.join(shotsDir, '.gitkeep')
if (!existsSync(gitkeep)) {
  await writeFile(gitkeep, '')
}

const relativeShots = path.relative(root, shotsDir).split(path.sep).join('/')

console.log(`
已创建：
  src/content/projects/${slug}.json
  ${relativeShots}/.gitkeep

接下来：
  1. 把截图放进 ${relativeShots}/，文件名要和 JSON 里 shots[].file 一致（现在是 shot-1.png）
  2. 改掉 JSON 里的占位文案
  3. npm run dev    → http://localhost:4321/${slug}/
  4. npm run readme → 同步 README 清单
  5. npm run shots  → 重新出全站截图
`)
