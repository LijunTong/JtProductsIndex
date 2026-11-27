import type { ImageMetadata } from 'astro'
import { getCollection } from 'astro:content'
import type { Product } from '../lib/product'
import { KIND_LABELS, resolveShots, statusLabel } from '../lib/product'

/**
 * 内容在这些文件里：src/content/projects/<slug>.json（一份一个项目）。
 * 截图放 src/assets/shots/<slug>/，JSON 里只写文件名。
 * 页面仍然从这里 import products，所以加项目不需要动任何 .astro / .ts。
 */
const shotImages = import.meta.glob<ImageMetadata>('/src/assets/shots/**/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
})

const DEFAULT_ORDER = 100

const products: Product[] = (await getCollection('projects'))
  .map(({ id, data }) => ({
    order: data.order ?? DEFAULT_ORDER,
    product: {
      slug: id,
      name: data.name,
      englishName: data.englishName,
      kind: data.kind,
      kindLabel: KIND_LABELS[data.kind],
      status: data.status,
      statusLabel: statusLabel(data.kind, data.status),
      year: data.year,
      tagline: data.tagline,
      summary: data.summary,
      platforms: data.platforms,
      version: data.version,
      repo: data.repo,
      releases: data.releases,
      cta: data.cta,
      metrics: data.metrics,
      features: data.features,
      shots: resolveShots(id, data.shots, shotImages),
      stack: data.stack,
      downloads: data.downloads ?? [],
      install: data.install,
      requirements: data.requirements,
      dataNote: data.dataNote,
    } satisfies Product,
  }))
  .sort((a, b) => a.order - b.order || a.product.name.localeCompare(b.product.name, 'zh-Hans-CN'))
  .map((entry) => entry.product)

export { products }
