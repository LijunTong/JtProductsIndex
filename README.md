# JT 出品 · 产品与研究索引

<!-- AUTO:projects -->
当前收录 3 个本地优先项目（2 个桌面应用、1 个插件），纯静态、零后端，构建产物直接发布到 GitHub Pages。页面结构不绑定桌面端，后续可以继续加入 Web、移动端、开源库和实验项目。

- 工作台（Work Station）· 桌面应用 · v1.0.2 — 跨平台桌面任务 / 项目管理器
- 几件事（Something）· 桌面应用 · v1.0.3 — Windows 桌面的天气、待办、日程、邮件聚合器
- 分支切换（Git Branch）· 插件 · v1.0.0 — 给 DeepSeek Harness 的分支控件插件
<!-- /AUTO:projects -->

每个项目先讲清楚解决什么问题，再给出真实截图和可直接使用的入口。桌面应用提供安装包，插件给出安装命令，未来其他项目可以改为打开网页、仓库或代码示例。

## 技术栈

| 层 | 选择 | 说明 |
| --- | --- | --- |
| 框架 | Astro 7（`output: 'static'`） | 默认零 JS，只有主题切换、灯箱、复制命令几段内联脚本 |
| 样式 | 原生 CSS + 自定义属性 | `src/styles/tokens.css` 深色/浅色两套色彩令牌，无预处理器 |
| 图片 | `astro:assets` | 构建期转 WebP、按宽度生成 srcset，自动写 width/height 防抖 |
| 字体 | 自托管可变字体 | `public/fonts` 里的 Archivo / JetBrains Mono（Latin 子集，74 KB），无第三方 CDN 请求 |
| 内容 | Astro Content Collections（JSON） | 一个项目一份 `src/content/projects/<slug>.json`，字段由 Zod schema 校验 |
| 校验 | TypeScript strict + `astro check` | 内容 schema、组件 props、脚本类型都在检查范围内 |
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
  content.config.ts        # 内容集合 + Zod schema（字段校验、交叉校验都在这里）
  content/projects/        # 一个项目一份 JSON，文件名就是 slug（/work-station/ 之类）
  data/products.ts         # 适配器：读集合、解析截图、排序；页面只从这里拿 products
  lib/product.ts           # 类型、形态/状态标签、describeIndex、截图解析与报错
  pages/index.astro        # 首页
  pages/[slug].astro       # 产品页（由集合自动生成，不写死 slug）
  pages/sitemap.xml.ts     # 构建期生成 sitemap
  pages/robots.txt.ts      # 构建期生成 robots
  layouts/BaseLayout.astro
  layouts/ProductLayout.astro
  components/              # SiteHeader、Plate（截图框）、ShotGallery、DownloadTable 等
  styles/tokens.css        # 设计令牌（深/浅两套）
  styles/fonts.css         # 自动生成：@font-face，勿手改
  assets/shots/<slug>/     # 该项目的截图（构建期处理，不直接进 public）
public/                    # favicon、og.png、fonts/ 等原样拷贝的文件
scripts/
  check-links.mjs          # 站内链接自检
  fetch-fonts.mjs          # 一次性：抓 Google Fonts 的 latin 可变字体
  gen-fonts-css.mjs        # predev/prebuild：生成 styles/fonts.css（带 BASE_PATH 前缀）
  gen-readme.mjs           # 重新生成 README 的项目清单块（--check 只比对）
  new-project.mjs          # 新建项目：生成 JSON 骨架 + 截图目录
  shoot.mjs                # 全站截图：构建 → 起临时静态服务 → 逐路由出图
  templates/project.json   # new-project 用的骨架模板
  og/                      # OG 分享图源文件 + 定尺寸截图脚本（见 og.html 顶部说明）
.github/workflows/deploy.yml
```

## 加一个项目

```bash
npm run new -- 我-的新项目 --name "我的新项目"
```

它会按 `scripts/templates/project.json` 建出：

```text
src/content/projects/我-的新项目.json   # 把占位文案换成真实内容
src/assets/shots/我-的新项目/.gitkeep   # 截图放这里
```

然后三步：

1. 截图放进 `src/assets/shots/<slug>/`，文件名写进 JSON 的 `shots[].file`（只需文件名，不要路径）。
2. 填 JSON 里的文案字段（见下表）。
3. `npm run dev` 看页面；`npm run readme` 同步 README 清单；`npm run shots` 出新截图。

`npm run build` 会校验内容：字段缺失、`kind` 不在枚举里、`shots[].file` 指向不存在的图片、`plugin` 没写 `install`、非插件项目既没 `downloads` 也没 `cta`，都会**直接报错并指出是哪个文件的哪个字段**，不会静默漏掉。

### 字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` / `englishName` | 是 | 中文名与英文名；首页表格、产品页标题、列表都用它们 |
| `kind` | 是 | `desktop`、`plugin`、`web`、`mobile`、`library`、`experiment`；形态名由代码查表得出 |
| `status` | 是 | `available`、`beta`、`archived`；可用状态下插件显示「可安装」，其余显示「可下载」 |
| `year` | 是 | 展示年份 |
| `order` | 否 | 排序，数字小的在前；不写按名称兜底 |
| `tagline` | 是 | 首屏一句短话（≤60 字） |
| `readme` | 否 | README 清单里的一句话说明；不写就用 `tagline` |
| `summary` | 是 | 详情页摘要，同时用作 meta description |
| `platforms` / `version` / `repo` | 是 | 平台列表、版本号、仓库地址；`releases` 可选，指向下载页 |
| `cta` | 否 | `{ label, href }`，没有下载包时的入口（如 `#install`） |
| `metrics` | 是 | 1–3 条 `{ value, label }`，详情页的大数字带 |
| `features` | 是 | 2–8 条 `{ title, body, tag? }` |
| `shots` | 是 | 至少一张 `{ file, alt, caption }`；第一张是封面与分享图来源 |
| `stack` | 是 | `{ label, items[] }` 技术栈，`items` 用 `·` 连起来显示 |
| `downloads` | 插件外必须 | `{ file, size, label, href }`；`size` 可以留空，界面显示 `—` |
| `install` | 插件必须 | `{ note, command, steps[] }`；`command` 支持复制 |
| `requirements` / `dataNote` | 是 | 运行环境说明、数据存放说明 |

### 改已有项目

只改 `src/content/projects/<slug>.json` 和 `src/assets/shots/<slug>/` 里的东西，页面与组件不用动。改完记得 `npm run readme`（CI 会跑 `npm run readme -- --check` 拦住漏更新）。

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
