import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

/**
 * 一个项目一份 JSON，文件名就是 slug（/work-station/ 之类）。
 * 截图只写文件名，路径由 src/data/products.ts 里的 import.meta.glob 解析；
 * 写了不存在的文件名会在构建时直接报错。
 */
const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: z
    .object({
      /** 首页与构建顺序；不写按名称排序 */
      order: z.number().int().optional(),
      name: z.string().min(1),
      englishName: z.string().min(1),
      kind: z.enum(['desktop', 'plugin', 'web', 'mobile', 'library', 'experiment']),
      status: z.enum(['available', 'beta', 'archived']),
      year: z.number().int().min(2000).max(2100),
      tagline: z.string().min(1).max(60),
      /** README 清单里的一句话说明；不写就用 tagline */
      readme: z.string().min(1).max(90).optional(),
      summary: z.string().min(1),
      platforms: z.array(z.string().min(1)).min(1),
      version: z.string().min(1),
      repo: z.url(),
      /** 「查看全部版本」之类的外链 */
      releases: z.url().optional(),
      cta: z.object({ label: z.string().min(1), href: z.string().min(1) }).optional(),
      metrics: z
        .array(z.object({ value: z.string().min(1), label: z.string().min(1) }))
        .min(1)
        .max(3),
      features: z
        .array(
          z.object({
            title: z.string().min(1),
            body: z.string().min(1),
            tag: z.string().min(1).optional(),
          }),
        )
        .min(2)
        .max(8),
      /** 第一张当封面；file 是 src/assets/shots/<slug>/ 下的原始文件名 */
      shots: z
        .array(
          z.object({
            file: z.string().min(1),
            alt: z.string().min(1),
            caption: z.string().min(1),
          }),
        )
        .min(1),
      stack: z.array(z.object({ label: z.string().min(1), items: z.array(z.string().min(1)).min(1) })).min(1),
      downloads: z
        .array(
          z.object({
            file: z.string().min(1),
            /** 文件大小，可以留空（界面上显示 —） */
            size: z.string(),
            label: z.string().min(1),
            href: z.url(),
          }),
        )
        .optional(),
      install: z
        .object({
          note: z.string().min(1),
          command: z.string().min(1),
          steps: z.array(z.string().min(1)).min(1),
        })
        .optional(),
      requirements: z.array(z.string().min(1)).min(1),
      dataNote: z.string().min(1),
    })
    .superRefine((value, ctx) => {
      if (value.kind === 'plugin' && !value.install) {
        ctx.addIssue({ code: 'custom', message: 'kind 是 plugin 时必须写 install（安装命令与步骤）' })
      }
      if (value.kind !== 'plugin' && !value.downloads && !value.cta) {
        ctx.addIssue({ code: 'custom', message: '非插件项目至少要写 downloads 或 cta，否则详情页没有入口' })
      }
    }),
})

export const collections = { projects }
