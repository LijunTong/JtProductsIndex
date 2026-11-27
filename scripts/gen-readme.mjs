#!/usr/bin/env node
/**
 * 用 src/content/projects/*.json 重新生成 README 里的项目清单块。
 *
 *   npm run readme            # 直接写回 README.md
 *   npm run readme -- --check # 只比对，不一致就以退出码 1 结束（CI 用）
 *
 * 只改 <!-- AUTO:projects --> 与 <!-- /AUTO:projects --> 之间的内容，
 * 这个标记块之外的部分随便手写。
 */
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const contentDir = path.join(root, 'src/content/projects')
const readmePath = path.join(root, 'README.md')

const START = '<!-- AUTO:projects -->'
const END = '<!-- /AUTO:projects -->'

// 与 src/lib/product.ts 的 KIND_SHORT_LABELS 保持一致；这里多的是中文名与图形
const KINDS = {
  desktop: '桌面应用',
  plugin: '插件',
  web: '网页应用',
  mobile: '移动应用',
  library: '库',
  experiment: '实验',
}

const check = process.argv.includes('--check')

const files = (await readdir(contentDir)).filter((file) => file.endsWith('.json')).sort()

const projects = []
for (const file of files) {
  const slug = file.replace(/\.json$/, '')
  const data = JSON.parse(await readFile(path.join(contentDir, file), 'utf8'))
  if (!KINDS[data.kind]) {
    console.error(`注意：${file} 的 kind "${data.kind}" 不在 README 生成器的类型表里，请同步 scripts/gen-readme.mjs`)
    process.exitCode = 1
  }
  projects.push({ slug, ...data })
}

projects.sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.slug.localeCompare(b.slug))

const counts = new Map()
for (const project of projects) counts.set(project.kind, (counts.get(project.kind) ?? 0) + 1)

const summary = [...counts.entries()]
  .map(([kind, count]) => `${count} 个${KINDS[kind] ?? kind}`)
  .join('、')

const bullets = projects.map((project) => {
  const line = project.readme ?? project.tagline
  return `- ${project.name}（${project.englishName}）· ${KINDS[project.kind] ?? project.kind} · v${project.version} — ${line}`
})

const block = [
  START,
  `当前收录 ${projects.length} 个本地优先项目（${summary}），纯静态、零后端，构建产物直接发布到 GitHub Pages。页面结构不绑定桌面端，后续可以继续加入 Web、移动端、开源库和实验项目。`,
  '',
  ...bullets,
  END,
].join('\n')

const readme = await readFile(readmePath, 'utf8')
const from = readme.indexOf(START)
const to = readme.indexOf(END)

if (from === -1 || to === -1) {
  console.error(`README.md 里找不到标记块 ${START} … ${END}`)
  process.exit(1)
}

const updated = readme.slice(0, from) + block + readme.slice(to + END.length)

if (check) {
  // 行尾差别（CRLF）不算内容变化
  const normalize = (text) => text.replace(/\r\n/g, '\n')
  if (normalize(updated) !== normalize(readme)) {
    console.error('README.md 的项目清单与 src/content/projects/ 不一致，请运行 npm run readme')
    process.exit(1)
  }
  console.log('README.md 项目清单是最新的')
} else if (updated !== readme) {
  await writeFile(readmePath, updated)
  console.log(`README.md 已更新：${projects.length} 个项目`)
} else {
  console.log('README.md 没有变化')
}
