# 终端档（Terminal）界面方案

> 选定方向：04 · C · TERMINAL。库来源 `terminal-cli-mobile`（去霓虹改造）。取代现有蓝色 SaaS 版。
> 效果图：`.impeccable/mocks/proof/shots/term-*.png`；可交互源：`.impeccable/mocks/terminal/*.html`（`home.html` / `product.html` / `plugin.html` / `t.css`）。

## 一、为什么是这个方向

站点的用户是「会自己去 Release 页拿 exe、会手动 `install_bundle` 的人」。终端世界不是装饰，是这个人群每天都在看的界面语言：等宽字、行号、命令和输出、`[ok]` 收尾。它让「三件本地优先的软件」这件事一眼成立，也让「没有账号、没有服务器」这种承诺有了视觉证据——命令本身就是证据。

同时否掉了三种滑坡：

- 不做霓虹赛博（`cyberpunk-ui`）：发光、扫描线、品红青绿会在中文长文上崩掉可读性，且是 AI 生成的典型痕迹。
- 不做整屏等宽正文：中文在等宽字体里没有对应字重，大段正文会退化成系统黑体。所以**标题用 Archivo**（无衬线、几何、字距收紧），**正文与元数据用等宽**，正文块行宽 ≤ 56ch。
- 不做「假终端」：没有滚动字幕、没有打字机动画、没有伪造的 `$ sudo`。命令行的部分是**真实可复制的命令**（`plugin_manager action=install_bundle target=…`），其余是克制的表格。

## 二、五条世界规则

1. **一条命令开头，一条 `[ok]` 收尾。** 首页首屏是 `$ ls -1 --long`，页脚是 `[ok] 3 项 · 16 张截图`。中间的每个区块都有命令名的标题（`下载`、`功能`、`截图`、`事实`）。
2. **绿只给状态，琥珀只给标识。** `● 可下载 / 可安装`、下载按钮、命令提示符是绿；序号 `01/02/03`、文件名、命令参数是琥珀。除此之外全灰阶，绝不用绿做装饰性下划线或标题。
3. **表格优先于卡片。** 列表用 `grid` 三到五列（idx / name / kind / ver / state），行 hover 只改背景色，不做阴影和位移动画。
4. **截图是证据，不给它加戏。** 截图放在 `1px` 暗框里，下挂一行 `文件名 — 说明 · 尺寸` 的元数据条，和 `ls -1 --long` 的输出格式一致。
5. **深色是本色，浅色是「纸终端」。** 两套不是反相了事：浅色把绿换成 `#1a7f37`、琥珀换成 `#8a5e00`（见对比度表），面板底色 `#fdfdfa`、页面 `#f6f6f2`，保持「打印出来的终端输出」的观感。

## 三、令牌

| 语义 | 深色（默认） | 浅色 `[data-theme="light"]` | 用途 |
|---|---|---|---|
| `--bg` | `#08090a` | `#f6f6f2` | 页面底 |
| `--panel` | `#0d0f10` | `#fdfdfa` | 表格、面板、截图框 |
| `--panel-2` | `#111615` | `#eeeeea` | 行 hover |
| `--fg` | `#d8dbd2` | `#202422` | 正文 |
| `--bright` | `#f3f5ee` | `#0f1412` | 标题 |
| `--dim` | `#7c8478` | `#6a716d` | 说明、元数据 |
| `--dim-2` | `#5b6260` | `#8b928d` | 分隔符、次要符号 |
| `--green` | `#7ee787` | `#1a7f37` | 状态、命令、下载 |
| `--green-ink` | `#0b1a0f` | `#ffffff` | 绿色按钮上的字 |
| `--amber` | `#e3b341` | `#8a5e00` | 序号、文件名、参数 |
| `--red` | `#ff7b72` | `#b3261e` | 逾期/删除等破坏性提示 |
| `--rule` | `#232823` | `#dcdcd4` | 主分隔线、面板边 |
| `--rule-soft` | `#191d1a` | `#e8e8e1` | 行间分隔 |

字体：`--mono: "JetBrains Mono", ui-monospace, "Cascadia Mono", "Microsoft YaHei", monospace`；`--sans: "Archivo", "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif`。中文没有等宽字形，落到系统的 `Microsoft YaHei` / `PingFang SC`，这是刻意的取舍：中文可读性优先于「像终端」。

## 四、排版与尺度

- h1：`clamp(40px, 6.4vw, 86px)`，`line-height 1.02`，`letter-spacing -0.045em`，Archivo 700，中文标题里最多一个 `<em>` 变量（绿色）。
- 区块标题 `h2.block`：11.5px 等宽、`letter-spacing .14em`、`--dim`，右侧一条 1px 线拉到边上。
- 正文 `.sub`：13.5px / 1.85，`max-width 56ch`。
- 表格行：10px 大写表头 + 12–13px 行内容，`padding 10px 14px`。
- 大数字（量级）：`clamp(26px, 3vw, 34px)` Archivo 700，`-0.03em`。
- 间距节奏：区块之间 `38px` 上边距、面板内 `14–16px`、页面左右 `clamp(20px, 4.4vw, 64px)`。

## 五、组件清单（对应现有 Astro 组件）

| 效果图里的东西 | 组件 | 说明 |
|---|---|---|
| 顶栏 `jt@local:~$` + 导航 + `theme: dark` + 版本 | `SiteHeader.astro` | 主题按钮是 `<button>`，写 `localStorage.jt-theme`，与现有 `[data-theme]` 机制一致 |
| 首页索引表 | `index.astro`（新 `.panel`） | 五列 `idx/name/kind/ver/state`，行是 `<a>`，整行可点 |
| 截图 + 元数据条 | `ProjectPreview.astro` / `ShotGallery.astro` | 1px 框 + `文件名 — 说明 · 尺寸` 条 |
| 三条要点 `# 数据在本机` | `FeatureGrid.astro` | 改成三格收边面板，`#` 前缀由 CSS 伪元素生成 |
| 下载表 | `DownloadTable.astro` | `文件名+副标题 / 大小 / ↓ 下载`，首行主按钮实心绿 |
| 安装命令块 | `DownloadTable.astro`（plugin 分支） | `$ plugin_manager action=install_bundle target=<路径>` + 三步骤 |
| 量级数字 | 新 `.specs` | 3 格，数字 + 一句说明 |
| 功能清单 | `FeatureGrid.astro` | 两栏，`+` 标记，行间下边框 |
| 事实三栏 | 新 `.facts` | 运行要求 / 数据放在哪 / 技术栈或许可证 |
| 页脚 | `SiteFooter.astro` | `[ok] …` 左，版权右 |

## 六、状态与交互

- 行 hover：`background: var(--panel-2)`，`transition: background .12s linear`（不做位移、不做阴影）。
- 按钮：默认描边绿、hover 反色填充；主按钮实心绿、hover 变描边。焦点 `outline: 2px solid var(--green); outline-offset: 2px`。
- 主题按钮：点击切换 `data-theme` 并写 `localStorage`，文案更新为 `theme: light/dark`。
- 光标：首屏提示行末尾一个 `steps(1)` 闪烁方块，`prefers-reduced-motion: reduce` 下静止常亮。
- 空状态/加载态：截图未加载时面板保留边框与元数据条（避免跳动）；下载表加载态用同宽骨架行。

## 七、对比度实测（WCAG 2.1，脚本计算）

| 组合 | 比值 | 结论 |
|---|---|---|
| `#d8dbd2` on `#08090a` 正文 | 14.22 | AAA |
| `#f3f5ee` on `#08090a` 标题 | 18.13 | AAA |
| `#8b9289` on `#08090a` 次要（`--dim`） | 6.24 | AA |
| `#8b9289` on `#0d0f10` 面板内次要 | 6.01 | AA |
| `#767d74` on `#08090a` 更次要（`--dim-2`，表头/图注） | 4.70 | AA（原 `#5b6260` 只有 3.19，已换） |
| `#767d74` on `#0d0f10` 面板内 | 4.53 | AA |
| `#7ee787` on `#08090a` 绿状态 | 12.97 | AAA |
| `#e3b341` on `#0d0f10` 琥珀 | 9.87 | AAA |
| `#0b1a0f` on `#7ee787` 绿按钮字 | 11.69 | AAA |
| `#202422` on `#f6f6f2` 浅色正文 | 14.50 | AAA |
| `#5f6663` on `#f6f6f2` 浅色次要（`--dim`） | 5.43 | AA |
| `#6a716d` on `#f6f6f2` 浅色更次要（`--dim-2`） | 4.62 | AA（原 `#8b928d` 只有 2.94，已换） |
| `#1a7f37` on `#f6f6f2` 浅色绿 | 4.69 | AA |
| `#ffffff` on `#1a7f37` 浅色按钮字 | 5.08 | AA |
| `#8a5e00` on `#f6f6f2` 浅色琥珀 | 5.26 | AA（原 `#9a6700` 为 4.49，已换） |

## 八、响应式

- `>900px`：五列表格、三格面板并排、截图两栏 + 一张通栏（截图按原比例，不裁切；只有插件页首图裁成 `4/3` 居中，因为浮层面板四周是空画布）。
- `≤900px`：表格降到四列（隐藏 kind，ver 贴右）、面板全部单列、截图单列、`<br class="bw">` 在标题里失效（`display:none`），标题改由 `text-wrap: balance` 断开。
- `≤640px`：顶栏折成两行——第一行 `jt@local:~$` + 主题按钮，第二行导航；版本号从右侧收起。
- `≤520px`：命令块字号降到 11.5px，改为横向滚动而不是折行。

## 九、落地记录（已完成）

**主题与字体**
- `tokens.css` 只剩两套主题令牌，默认深色；主题键 `localStorage['theme']`（不是样张里的 `jt-theme`）。
- 字体自托管：`scripts/fetch-fonts.mjs` 只抓 `/* latin */` 段，落 `public/fonts/*.woff2`——Google 对字重区间返回的是**可变字体**（一份文件覆盖整个轴），所以只有两个文件：`archivo.woff2`（400–700，34 KB）、`jetbrains-mono.woff2`（300–500，40 KB），合计 74 KB；CJK 走系统回落。
- `scripts/gen-fonts-css.mjs` 生成 `src/styles/fonts.css`，URL 前缀取 `BASE_PATH`——Vite 不会重写 `public/` 资源在 CSS 里的绝对 URL，子路径部署必须自己带前缀；挂在 `predev` / `prebuild`。
- 站点不引 Google Fonts CDN：没有任何第三方请求，和「无统计脚本」的承诺一致。

**页面与组件**
| 文件 | 变化 |
|---|---|
| `SiteHeader.astro` | `jt@local:~$` + 导航 + `theme: dark` 按钮（`aria-pressed`），≤640px 折两行 |
| `index.astro` | 首屏命令 + 索引表 + 三张通栏封面 + 三条要点 + `cat about.md` |
| `ProductLayout.astro` | 面包屑、hero + 元数据格、下载表或安装命令块、量级三格、功能两栏、截图、事实三栏 |
| `Plate.astro`（新增） | 取代 `ProjectPreview`：1px 暗框 + 琥珀文件名 + 说明，`ratio` 可选裁切 |
| `ShotGallery.astro` | 两栏 + 首图通栏、灯箱保留放大与 Esc，`dialog` 主题化 |
| `FeatureGrid.astro` | 两栏 `+` 列表，去掉 `columns` 参数 |
| `SectionHeading.astro` | 改成 `command/title/description`，渲染成 `$ 命令` + 拉线 |
| `404.astro` | `cat: No such file or directory` + 两个出口 |

**数据**
- `Shot` 增加 `file: string`（16 条全部补齐）。构建后 `src.src` 带哈希，图注要显示原始文件名只能显式带。
- 分支切换的截图顺序改成「面板 → 首页 → 新建 → 初始化」：原来的首图是一张几乎全空的欢迎页，不适合当封面。

**验证**
- `npm run check` 23 文件 0 error；`npm run build` 5 页；`BASE_PATH=/JtProductsIndex npm run build` 后 `npm run check:links` 73 个链接全部有效。
- 按 CI 形态在 `/tmp/site/JtProductsIndex` 起静态服务截图核对，覆盖首页/工作台/几件事/分支切换/404 的深色与浅色、1440 与 390，`broken: []`。

## 十、硬红线（写代码时不许破）

- 绿只表达状态与操作，不做标题装饰、不做渐变、不做发光。
- 不用 emoji 当图标；需要图标时手绘 12–16px 的 SVG 线稿。
- 不用等宽字排大段正文（≤56ch 且只到 13.5px）。
- 不给表格加圆角和阴影；不做「假终端」的假命令输出。
- 深浅两套都要单独实测对比度，不能靠推断。

## 十一、仍未做

- 「几件事」产品页没有单独效果图（结构与工作台一致，只是把三档量级换成功能条目）。
- 没有骨架屏/空态：站点没有异步数据，唯一异步的是灯箱图片，已在既有实现里处理。
- 进场动效只有光标闪烁这一处编排；滚动入场、渐显全部没有做（也不打算做）。
- 站点还没有 dark/light 的「跟随系统」默认值以外的偏好迁移逻辑：旧键 `jt-theme` 已废弃，不做兼容。
