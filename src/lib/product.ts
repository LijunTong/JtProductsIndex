import type { ImageMetadata } from 'astro'

export type ProjectKind = 'desktop' | 'plugin' | 'web' | 'mobile' | 'library' | 'experiment'
export type ProjectStatus = 'available' | 'beta' | 'archived'

/** 详情页 meta 里显示的形态名 */
export const KIND_LABELS: Record<ProjectKind, string> = {
  desktop: '桌面应用',
  plugin: 'DSH 插件',
  web: '网页应用',
  mobile: '移动应用',
  library: '库 / 工具',
  experiment: '实验项目',
}

/** 首页表格与概述句里用的短名 */
export const KIND_SHORT_LABELS: Record<ProjectKind, string> = {
  desktop: '桌面应用',
  plugin: '插件',
  web: '网页应用',
  mobile: '移动应用',
  library: '库',
  experiment: '实验',
}

/** 概述句里形态的出现顺序 */
export const KIND_ORDER: ProjectKind[] = ['desktop', 'plugin', 'web', 'mobile', 'library', 'experiment']

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  available: '可用',
  beta: '内测',
  archived: '已归档',
}

/** 可安装的项目说「可安装」，有安装包的「可下载」，只给仓库地址的「可获取」 */
export function statusLabel(
  kind: ProjectKind,
  status: ProjectStatus,
  options: { downloadable?: boolean } = {},
): string {
  if (status !== 'available') return STATUS_LABELS[status]
  if (kind === 'plugin') return '可安装'
  return options.downloadable === false ? '可获取' : '可下载'
}

export interface Shot {
  /** 构建后的图片地址（Astro 会加哈希，界面不展示） */
  src: ImageMetadata
  /** src/assets/shots/<slug>/ 下的原始文件名 */
  file: string
  alt: string
  caption: string
}

export interface Download {
  file: string
  /** 文件大小，可能为空 */
  size: string
  label: string
  href: string
}

export interface Install {
  note: string
  command: string
  steps: string[]
}

export interface Metric {
  value: string
  label: string
}

export interface Feature {
  title: string
  body: string
  tag?: string
}

export interface StackItem {
  label: string
  items: string[]
}

export interface Product {
  slug: string
  name: string
  englishName: string
  kind: ProjectKind
  kindLabel: string
  status: ProjectStatus
  statusLabel: string
  year: number
  tagline: string
  summary: string
  platforms: string[]
  version: string
  repo: string
  releases?: string
  cta?: { label: string; href: string }
  metrics: Metric[]
  features: Feature[]
  shots: Shot[]
  stack: StackItem[]
  downloads: Download[]
  install?: Install
  requirements: string[]
  dataNote: string
}

/** 「3 个项目：2 个桌面应用、1 个插件」——项目数量变了这句会自己跟上 */
export function describeIndex(products: Product[]): string {
  const counts = new Map<ProjectKind, number>()
  for (const product of products) {
    counts.set(product.kind, (counts.get(product.kind) ?? 0) + 1)
  }
  const parts = KIND_ORDER.filter((kind) => counts.has(kind)).map(
    (kind) => `${counts.get(kind)} 个${KIND_SHORT_LABELS[kind]}`,
  )
  return `${products.length} 个项目：${parts.join('、')}`
}

/** 截图真实字节数 → 「约 45 MB」「1.2 MB」「640 KB」，拿不到就空字符串 */
export function humanSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return ''
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  const mb = bytes / 1024 / 1024
  return `${mb >= 10 ? Math.round(mb) : mb.toFixed(1)} MB`
}

export interface ShotResolution {
  src: ImageMetadata
  file: string
  alt: string
  caption: string
}

/**
 * 把 JSON 里写的文件名映射成 ImageMetadata。
 * - 写错文件名 / 大小写不一致 → 抛错（构建失败），错误里带项目、缺的文件、该目录现有文件
 * - 目录里存在但 JSON 没引用 → 打 warning（不阻断构建）
 */
export function resolveShots(
  slug: string,
  shots: { file: string; alt: string; caption: string }[],
  images: Record<string, ImageMetadata>,
): Shot[] {
  // glob 的 key 形如 /src/assets/shots/<slug>/<file>，这里统一裁成 <slug>/<file>
  const prefix = `${slug}/`
  const available = Object.keys(images)
    .map((path) => path.replace(/^.*?\/shots\//, ''))
    .filter((path) => path.startsWith(prefix))
    .map((path) => path.slice(prefix.length))
  const keyByRelative = new Map(
    Object.keys(images).map((path) => [path.replace(/^.*?\/shots\//, ''), path]),
  )
  const lower = new Map(available.map((name) => [name.toLowerCase(), name]))

  const missing: string[] = []
  const resolved = shots.map((shot) => {
    const src = images[keyByRelative.get(prefix + shot.file) ?? '']
    if (src) return { src, ...shot }

    const actual = lower.get(shot.file.toLowerCase())
    if (actual) {
      throw new Error(
        `[projects] ${slug}: 截图文件名大小写不匹配 —— JSON 写的是 "${shot.file}"，磁盘上是 "${actual}"。\n` +
          `Linux 上的构建区分大小写，请改成磁盘上的写法。`,
      )
    }
    missing.push(shot.file)
    return null
  })

  if (missing.length > 0) {
    throw new Error(
      `[projects] ${slug}: 找不到截图 ${missing.map((file) => `"${file}"`).join('、')}\n` +
        `请把图片放进 src/assets/shots/${slug}/，或改掉 src/content/projects/${slug}.json 里的 shots[].file。\n` +
        `该目录现有：${available.length > 0 ? available.join('、') : '（空）'}`,
    )
  }

  const unused = available.filter((name) => !shots.some((shot) => shot.file === name))
  if (unused.length > 0) {
    console.warn(
      `[projects] ${slug}: src/assets/shots/${slug}/ 里有图片没有被 JSON 引用：${unused.join('、')}`,
    )
  }

  return resolved as Shot[]
}
