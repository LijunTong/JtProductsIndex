// 生成 src/styles/fonts.css：把 public/fonts 里的可变字体接成 @font-face。
// 部署在子路径（BASE_PATH=/JtProductsIndex）时必须带上前缀，所以这条 URL 交给构建时算，
// 不写死在 CSS 里。predev / prebuild 自动执行。
import { readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const base = (process.env.BASE_PATH ?? '/').replace(/\/+$/, '')
const urlBase = `${base}/fonts`

// 字体族 → 文件名前缀 / 字重区间（可变字体一份文件覆盖整个轴）
const FAMILIES = [
  { family: 'Archivo', prefix: 'archivo', weights: '400 700' },
  { family: 'JetBrains Mono', prefix: 'jetbrains-mono', weights: '300 500' },
]

// Google Fonts 的 Latin 子集；CJK 交给系统字体。
const LATIN =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, ' +
  'U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'

const files = new Set(await readdir(join(process.cwd(), 'public', 'fonts')))
const faces = []

for (const { family, prefix, weights } of FAMILIES) {
  if (!files.has(`${prefix}.woff2`)) {
    throw new Error(`缺字体文件 public/fonts/${prefix}.woff2（先跑 npm run fonts:fetch）`)
  }
  faces.push(`@font-face {
  font-family: '${family}';
  font-style: normal;
  font-weight: ${weights};
  font-display: swap;
  src: url('${urlBase}/${prefix}.woff2') format('woff2');
  unicode-range: ${LATIN};
}`)
}

const css = `/* 自托管字体（Latin 子集，可变字重；CJK 回落系统字体）。此文件由 scripts/gen-fonts-css.mjs 生成，勿手改。 */

${faces.join('\n\n')}
`

await writeFile(join(process.cwd(), 'src', 'styles', 'fonts.css'), css)
console.log(`fonts.css: ${faces.length} 个 @font-face → ${urlBase}/`)
