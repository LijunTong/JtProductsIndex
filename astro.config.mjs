import { defineConfig } from 'astro/config'

// 站点与部署路径集中在这里：换仓库名 / 换自定义域名只改环境变量，不改模板。
const site = process.env.SITE_URL ?? 'https://lijuntong.github.io'
const base = process.env.BASE_PATH ?? '/'

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
})
