import type { ImageMetadata } from 'astro'
import wsDashboard from '../assets/shots/work-station/dashboard.png'
import wsBoard from '../assets/shots/work-station/board-dark.png'
import wsTasks from '../assets/shots/work-station/tasks.png'
import wsReminders from '../assets/shots/work-station/reminders.png'
import wsPalette from '../assets/shots/work-station/command-palette.png'
import wsTheme from '../assets/shots/work-station/custom-theme.png'
import smDashboard from '../assets/shots/something/dashboard.png'
import smWeather from '../assets/shots/something/weather.png'
import smTodo from '../assets/shots/something/todo.png'
import smSchedule from '../assets/shots/something/schedule.png'
import smMail from '../assets/shots/something/mail.png'
import smMcp from '../assets/shots/something/mcp.png'
import gbOverview from '../assets/shots/git-branch-tool/overview.png'
import gbPanel from '../assets/shots/git-branch-tool/branch-panel.png'
import gbNew from '../assets/shots/git-branch-tool/new-branch.png'
import gbInit from '../assets/shots/git-branch-tool/init-repo.png'

export type Shot = {
  src: ImageMetadata
  alt: string
  caption: string
}

export type Feature = {
  title: string
  body: string
  tag?: string
}

export type ProjectKind = 'desktop' | 'web' | 'mobile' | 'library' | 'experiment' | 'plugin'
export type ProjectStatus = 'available' | 'beta' | 'archived'
export type ProjectTone = 'violet' | 'teal' | 'blue' | 'orange'
export type PreviewType = 'desktop' | 'browser' | 'phone' | 'code' | 'image'

export type Download = {
  label: string
  note: string
  href: string
}

export type Install = {
  note: string
  command: string
  steps: string[]
}

export type Product = {
  slug: string
  name: string
  englishName: string
  kind: ProjectKind
  kindLabel: string
  status: ProjectStatus
  statusLabel: string
  year: number
  tone: ProjectTone
  preview: PreviewType
  tagline: string
  summary: string
  platforms: string[]
  version: string
  repo: string
  releases?: string
  cta?: { label: string; href: string }
  metrics: { value: string; label: string }[]
  features: Feature[]
  shots: Shot[]
  stack: { label: string; items: string[] }[]
  downloads: Download[]
  install?: Install
  requirements: string[]
  dataNote: string
}

const GH = 'https://github.com/LijunTong'

export const products: Product[] = [
  {
    slug: 'work-station',
    name: '工作台',
    englishName: 'Work Station',
    kind: 'desktop',
    kindLabel: '桌面应用',
    status: 'available',
    statusLabel: '可下载',
    year: 2026,
    tone: 'violet',
    preview: 'desktop',
    tagline: '把手上的项目和任务，放进一个能一眼看清的看板。',
    summary:
      '跨平台的桌面任务管理器。看板拖拽、仪表盘汇总、逾期提醒，全部写进本机 SQLite —— 没有注册，没有同步，没有隐藏的服务器。',
    platforms: ['Windows 10/11', 'Linux'],
    version: '1.0.2',
    repo: `${GH}/work-station`,
    releases: `${GH}/work-station/releases/latest`,
    metrics: [
      { value: '4', label: '列看板：待办、进行中、已阻塞、已完成' },
      { value: '3', label: '档周期视图：今日、本周、本月' },
      { value: 'SQLite', label: '单文件保存全部数据' },
    ],
    features: [
      {
        title: '看板视图',
        body: '按状态横向铺开所有任务，拖一下即可改变状态；逾期任务自动标红，并给出最早逾期日期。',
        tag: '核心',
      },
      {
        title: '仪表盘汇总',
        body: '今日、本周、本月的完成率与到期数量集中在一屏，附 7 天到期趋势和状态、优先级分布。',
      },
      {
        title: '项目与分组',
        body: '任务可以归属到项目，项目进度按完成比例展示；看板还能在「任务看板」和「项目看板」之间切换。',
      },
      {
        title: '提醒与托盘',
        body: '给任务设置提醒时间，到点由系统通知推送；关掉主窗口后常驻托盘，提醒不会漏。',
      },
      {
        title: '命令面板',
        body: '一组快捷键唤起命令面板，搜索任务或直接跳到某个视图，双手不用离开键盘。',
      },
      {
        title: '主题与配色',
        body: '浅色、深色，或自己挑一组强调色；主题切换即时生效，对话框也会跟着变。',
      },
    ],
    shots: [
      {
        src: wsBoard,
        alt: '工作台的深色看板界面：待办、进行中、已阻塞、已完成四列任务卡，顶部显示逾期数量。',
        caption: '看板：四列流转，逾期标红',
      },
      {
        src: wsDashboard,
        alt: '工作台仪表盘：今日、本周、本月的完成率圆环，需要立刻处理提示，今日任务清单与项目进度。',
        caption: '仪表盘：完成率、逾期与项目进度',
      },
      {
        src: wsTasks,
        alt: '工作台的任务列表，按截止时间排列，显示优先级、所属项目和状态。',
        caption: '任务列表：所有待办按截止时间排开',
      },
      {
        src: wsReminders,
        alt: '工作台的提醒列表，显示每条任务的下次提醒时间与开关。',
        caption: '提醒：到点推系统通知',
      },
      {
        src: wsPalette,
        alt: '工作台的命令面板浮层，可搜索任务或视图，右侧列出快捷键。',
        caption: '命令面板：键盘直达',
      },
      {
        src: wsTheme,
        alt: '工作台的自定义主题对话框，可选择强调色并实时预览界面配色。',
        caption: '主题：浅色、深色与自定义强调色',
      },
    ],
    stack: [
      { label: '运行时', items: ['.NET 10'] },
      { label: '界面', items: ['Avalonia', 'SukiUI'] },
      { label: '存储', items: ['SQLite（本机）'] },
    ],
    downloads: [
      { label: 'Windows 安装包', note: 'WorkStation-Setup-1.0.2.exe · 约 45 MB', href: `${GH}/work-station/releases/latest` },
      { label: 'Linux（Debian / Ubuntu）', note: 'workstation_1.0.2_amd64.deb', href: `${GH}/work-station/releases/latest` },
      { label: 'Linux（通用压缩包）', note: 'workstation-1.0.2-linux-x86_64.tar.gz', href: `${GH}/work-station/releases/latest` },
    ],
    requirements: ['Windows 10 1809 及以上，或主流 Linux 发行版', '首次启动会自动创建本地数据库，无需额外配置'],
    dataNote: '数据默认保存在本机用户目录下的 SQLite 文件里；换机器需要自己拷贝，程序不会上传到任何服务器。',
  },
  {
    slug: 'something',
    name: '几件事',
    englishName: 'Something',
    kind: 'desktop',
    kindLabel: '桌面应用',
    status: 'available',
    statusLabel: '可下载',
    year: 2026,
    tone: 'teal',
    preview: 'desktop',
    tagline: '天气、待办、日程、邮件和专注计时，装进一个窗口。',
    summary:
      'Windows 桌面上的日常面板。左侧切换天气、日程、待办、番茄钟、信息流和邮件，右侧始终是今天最该看的东西。数据落在本机 SQLite，账号只在你配置邮箱时出现。',
    platforms: ['Windows 10/11'],
    version: '1.0.3',
    repo: `${GH}/Something`,
    releases: `${GH}/Something/releases/latest`,
    metrics: [
      { value: '5', label: '个日常模块：天气、日程、待办、专注、信息流' },
      { value: '本机', label: 'SQLite 保存待办、日程与邮件缓存' },
      { value: 'MCP', label: '本机 Agent 可把计划写成待办' },
    ],
    features: [
      {
        title: '天气',
        body: '多城市切换、当前体感与湿度风速，再往后是未来几小时的逐时预报；结果缓存在本地。',
      },
      {
        title: '今日待办',
        body: '按截止时间排开今天的任务，标出优先级与逾期项；完成一项就少一项，数字当场更新。',
      },
      {
        title: '日程时间轴',
        body: '把当天的会议与约定按时间轴列出，每条可设提前提醒，到点由通知提醒你。',
      },
      {
        title: '邮件收件箱',
        body: '通过 IMAP 读取收件箱，按文件夹浏览、搜索并阅读正文；邮件缓存在本机，不经过第三方。',
      },
      {
        title: '番茄钟与信息流',
        body: '25 分钟专注计时配当日目标，旁边是订阅的信息流，工作间隙顺手扫一眼。',
      },
      {
        title: 'Agent 接入（MCP）',
        body: '开启后在本机 127.0.0.1 提供 MCP 服务，AI 助手可以把一份项目计划直接写成清单和子任务。',
        tag: '进阶',
      },
    ],
    shots: [
      {
        src: smDashboard,
        alt: '几件事仪表盘：左侧导航，右侧依次是天气卡片、今日日程、今日待办和番茄钟。',
        caption: '仪表盘：一屏看完今天',
      },
      {
        src: smWeather,
        alt: '几件事的天气页：城市标签、当前温度与天气图标、湿度风速降水，下方是逐时预报。',
        caption: '天气：多城市与逐时预报',
      },
      {
        src: smTodo,
        alt: '几件事的待办页：任务带着截止时间和优先级标签，可直接勾选完成。',
        caption: '待办：截止时间与优先级',
      },
      {
        src: smSchedule,
        alt: '几件事的日程页：按时间轴排列当天的日程，每条显示时间、时长与提前提醒。',
        caption: '日程：时间轴与提前提醒',
      },
      {
        src: smMail,
        alt: '几件事的邮件页：左侧统一收件箱与文件夹，右侧邮件列表显示发件人、主题与摘要。',
        caption: '邮件：本机 IMAP 收件箱',
      },
      {
        src: smMcp,
        alt: '几件事的设置页 Agent 接入面板：MCP 服务开关、本机端口 3939、访问令牌与客户端配置片段。',
        caption: 'MCP：把计划写成待办',
      },
    ],
    stack: [
      { label: '运行时', items: ['Electron', 'Node.js'] },
      { label: '界面', items: ['Vue 3', 'Naive UI'] },
      { label: '存储', items: ['SQLite（better-sqlite3）'] },
    ],
    downloads: [
      { label: 'Windows 安装包', note: 'Something-Setup-1.0.3.exe · 约 99 MB', href: `${GH}/Something/releases/latest` },
    ],
    requirements: ['Windows 10/11', '邮件功能需要你自己的 IMAP 账号（可选）'],
    dataNote: '待办、日程、邮件缓存都存在本机 SQLite；卸载时默认保留数据目录，重装后可以直接接着用。',
  },
  {
    slug: 'git-branch-tool',
    name: '分支切换',
    englishName: 'Git Branch',
    kind: 'plugin',
    kindLabel: 'DSH 插件',
    status: 'available',
    statusLabel: '可安装',
    year: 2026,
    tone: 'blue',
    preview: 'browser',
    tagline: '换分支不用切回终端。',
    summary:
      '给 DeepSeek Harness 写的一个分支控件。输入框旁边放着分支图标和当前分支名，点开就能看到本地与远程分支、和上游的差距，直接切换或新建；工作目录还不是仓库时，同一个面板里就能初始化。',
    platforms: ['Windows', 'macOS', 'Linux'],
    version: '1.0.0',
    repo: `${GH}/git-branch-tool`,
    cta: { label: '安装方式', href: '#install' },
    metrics: [
      { value: '5', label: '个可放置的位置：输入框工具栏、会话标题旁等' },
      { value: '5', label: '个分支动作：列出、切换、新建、初始化、删除' },
      { value: '本机', label: '所有操作调用本机 git，不走网络' },
    ],
    features: [
      {
        title: '分支控件',
        body: '输入框工具栏里一个分支图标、当前分支名和一个状态点：绿点表示工作区干净，黄点表示有未提交改动，灰点表示正在读取或当前目录不是仓库。',
        tag: '核心',
      },
      {
        title: '切换分支',
        body: '本地分支排在前面，远程分支收起来并带数量；顶部有筛选框，当前分支标「当前」，行尾的 ↑N ↓N 是与上游的差距。点一下即切换，控件标签立刻刷新。',
      },
      {
        title: '新建分支',
        body: '面板底部是「分支名 + 起点 + 创建并切换」，起点下拉默认当前分支，填好名字回车就创建并切过去。',
      },
      {
        title: '非 Git 目录也能开始',
        body: '工作目录还不是仓库时，控件显示「非 Git 仓库」，面板里给一个按钮，就地执行 git init，不用先开终端。',
      },
      {
        title: '命令与工具',
        body: '除了点界面，还能用 /branch list | switch | create | init 命令，或让对话里的 Agent 调用 git_branch 工具完成同样的事。',
        tag: '进阶',
      },
      {
        title: '位置随你放',
        body: '控件可以挂在 5 个位置之一，在设置里改；偏好存在浏览器 localStorage 里，不写配置文件。',
      },
    ],
    shots: [
      {
        src: gbOverview,
        alt: 'DeepSeek Harness 的首页：输入框工具栏里是分支图标、当前分支 master 和一个绿色状态点。',
        caption: '控件：当前分支就在输入框旁边',
      },
      {
        src: gbPanel,
        alt: '分支面板：顶部是筛选框，本地分支逐个列出，当前分支标「当前」，其余显示与上游的领先落后数量，底部是新建分支的输入框与起点下拉。',
        caption: '面板：本地、远程与上游差距',
      },
      {
        src: gbNew,
        alt: '在分支面板底部填入新分支名 feature/git-ui，从 master 起点的下拉里选择起点后点「创建并切换」。',
        caption: '新建：分支名 + 起点',
      },
      {
        src: gbInit,
        alt: '非 Git 目录下的分支面板：显示当前目录不是 Git 仓库，并给出「在此目录创建 Git 仓库」按钮。',
        caption: '非 Git 目录：一键初始化',
      },
    ],
    stack: [
      { label: '宿主', items: ['DeepSeek Harness（Cordis 插件）'] },
      { label: '界面', items: ['React'] },
      { label: '实现', items: ['Node.js', '本机 git CLI'] },
    ],
    downloads: [],
    install: {
      note: '没有安装包，这是一个插件目录：由 Harness 的插件管理器链接安装。源码以 MIT 许可发布。',
      command: 'plugin_manager action=install_bundle target=<插件目录绝对路径>',
      steps: [
        '把这个仓库克隆到本机任意目录',
        '在 Harness 的插件管理器里指向该目录安装（本地目录会被链接，不需要打包）',
        '装好后在设置 → Git 分支里挑选控件位置',
      ],
    },
    requirements: ['DeepSeek Harness（需要支持 Cordis 插件的版本）', '本机已安装 git 并在 PATH 里'],
    dataNote: '分支操作全部交给本机 git，插件只读取当前工作目录的仓库状态；没有账号，也不经过任何服务器。',
  },
]

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug)
