# JT 出品 · 产品与研究索引

当前收录三个本地优先项目（两个桌面应用 + 一个编辑器插件），纯静态、零后端，构建产物直接发布到 GitHub Pages。页面结构不绑定桌面端，后续可以继续加入 Web、移动端、开源库和实验项目。

- 工作台（Work Station）：跨平台桌面任务 / 项目管理器
- 几件事（Something）：Windows 桌面的天气、待办、日程、邮件聚合器
- 分支切换（Git Branch）：给 DeepSeek Harness 的分支控件插件

每个项目先讲清楚解决什么问题，再给出真实截图和可直接使用的入口。桌面应用提供安装包，插件给出安装命令，未来其他项目可以改为打开网页、仓库或代码示例。

## 技术栈

| 层 | 选择 | 说明 |
| --- | --- | --- |
| 框架 | Astro 7（`output: 'static'`） | 默认零 JS，只有主题切换、灯箱、复制命令几段内联脚本 |
| 样式 | 原生 CSS + 自定义属性 | `src/styles/tokens.css` 深色/浅色两套色彩令牌，无预处理器 |
| 图片 | `astro:assets` | 构建期转 WebP、按宽度生成 srcset，自动写 width/height 防抖 |
| 字体 | 自托管可变字体 | `public/fonts` 里的 Archivo / JetBrains Mono（Latin 子集，74 KB），无第三方 CDN 请求 |
| 校验 | TypeScript strict + `astro check` | 内容源 `products.ts` 带完整类型 |
| 发布 | GitHub Actions → Pages | 无第三方托管依赖 |

## 本地开发

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 产出 dist/
npm run preview    # 预览构建结果
npm run check      # 类型 + Astro 模板检查
npm run check:links # 构建后检查站内链接
npm run fonts      # 重新下载自托管字体（只在换字体时需要）
```

Node ≥ 22。

## 目录结构

```text
src/
  data/products.ts        # 唯一内容源：文案、类型、功能、截图、下载、技术栈
  pages/index.astro       # 首页
  pages/[slug].astro      # 产品页（/work-station/、/something/、/git-branch-tool/）
  pages/sitemap.xml.ts    # 构建期生成 sitemap
  pages/robots.txt.ts     # 构建期生成 robots
  layouts/BaseLayout.astro
  layouts/ProductLayout.astro
  components/             # SiteHeader、Plate（截图框）、ShotGallery、DownloadTable 等
  styles/tokens.css       # 设计令牌（深/浅两套）
  styles/fonts.css        # 自动生成：@font-face，勿手改
  assets/shots/           # 原始截图（构建期处理，不直接进 public）
public/                   # favicon、og.png、fonts/ 等原样拷贝的文件
scripts/check-links.mjs   # 站内链接自检
scripts/fetch-fonts.mjs   # 一次性：抓 Google Fonts 的 latin 可变字体
scripts/gen-fonts-css.mjs # predev/prebuild：生成 styles/fonts.css（带 BASE_PATH 前缀）
scripts/og/               # OG 分享图源文件 + 定尺寸截图脚本（见 og.html 顶部说明）
.github/workflows/deploy.yml
```

## 改内容

绝大多数改动只碰 `src/data/products.ts`：

- `kind` / `kindLabel`：项目形态，支持 `desktop`、`plugin`、`web`、`mobile`、`library`、`experiment`
- `status` / `statusLabel`：项目状态，支持 `available`、`beta`、`archived`
- `year`：项目展示年份
- `tone`：项目色调，支持 `violet`、`teal`、`blue`、`orange`
- `preview`：预览外壳，支持 `desktop`、`browser`、`phone`、`code`、`image`
- `summary` / `tagline`：首屏文案，`summary` 同时用作 meta description
- `features`：功能条目，`tag` 可选（如「核心」）
- `shots`：截图数组，第一张同时是产品页首图与分享图来源；每项必须有 `file`（图注里显示的原始文件名，构建后 `src` 会带哈希）
- `downloads`：下载表格行，`href` 指向 GitHub Release 资产
- `stack` / `requirements` / `dataNote`：技术栈、运行环境、数据说明

截图放进 `src/assets/shots/<slug>/` 再用 `import` 引入；不要放 `public/`，否则不会做尺寸优化。

界面方向的来龙去脉写在 `docs/design/terminal.md`（令牌、组件映射、对比度实测、落地记录），可选方向对照在 `docs/design/options.md`。

## 部署

1. 推送到 GitHub，仓库默认分支为 `master`。
2. 首次推送会触发 `.github/workflows/deploy.yml`：安装 → `astro check` → 构建 → 链接自检 → 把 `dist/` 强推到 `gh-pages` 分支。等这次运行变绿（`gh-pages` 分支才会出现）。
3. 仓库 **Settings → Pages → Build and deployment → Source** 选 **Deploy from a branch**，分支选 `gh-pages`、目录 `/ (root)`，保存。
4. 之后每次 push 到 `master`，工作流都会重建并覆盖 `gh-pages`，Pages 自动生效。

`public/.nojekyll` 会被一起发布，否则 GitHub 的 Jekyll 会忽略 `_astro/` 这类下划线目录，样式和图片全部 404。

默认发布地址为 `https://<user>.github.io/<repo>/`，因此构建时带 `BASE_PATH=/<repo>`。

需要改地址时，在仓库 **Settings → Secrets and variables → Actions → Variables** 设置：

| 变量 | 示例 | 作用 |
| --- | --- | --- |
| `SITE_URL` | `https://example.com` | canonical、OG、sitemap 的域名 |
| `BASE_PATH` | `/` 或 `/JtProductsIndex` | 站点路径前缀，用户主页仓库填 `/` |

自定义域名：先在 Pages 里绑定域名，再把 `BASE_PATH` 设为 `/`、`SITE_URL` 设为该域名。

## 版权

本站的文案、截图与代码均由本人创作，保留所有权利（All rights reserved）。仓库未附带任何开源许可协议，未经书面许可不得复制、分发或用于商业用途。

## 验收清单

- [x] 390 / 768 / 1440 三档无横向滚动
- [x] 构建产物无破图、无失效站内链接（`npm run check:links`）
- [x] 截图经 WebP 压缩并带 srcset
- [x] WebSite / SoftwareApplication 结构化数据、sitemap、robots
- [ ] 首次推送后确认 `gh-pages` 分支生成、Pages 地址可访问
