#!/usr/bin/env node
/**
 * 全站截图：构建 → 起一个临时静态服务 → 用 Chrome DevTools Protocol 逐路由出图。
 *
 *   npm run shots              # 1440 + 390，深色；首页额外出浅色
 *   npm run shots -- --only work-station
 *   npm run shots -- --themes dark        # 不额外出浅色
 *
 * 产出：.impeccable/shots/<YYYYMMDD-HHmm>/<route>-<width>.png
 * 有破图或横向滚动时打印问题清单并以退出码 1 结束。
 */
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { mkdir, mkdtemp, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const dist = path.join(root, 'dist')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
}

const VIEWPORTS = [1440, 390]
const MAX_HEIGHT = 8000

const argv = process.argv.slice(2)
const only = argValue('--only')
const extraLight = !argv.includes('--no-light') && argValue('--themes') !== 'dark'

function argValue(name) {
  const index = argv.indexOf(name)
  return index === -1 ? undefined : argv[index + 1]
}

function stamp() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean)
  return candidates.find((candidate) => existsSync(candidate))
}

/** 跑一个 node 脚本并等它结束；不经过 npm，免得 Windows 上 spawn .cmd 报 EINVAL */
function runNode(script, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], {
      cwd: root,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, ...env },
    })
    let output = ''
    child.stdout.on('data', (chunk) => {
      output += chunk
    })
    child.stderr.on('data', (chunk) => {
      output += chunk
    })
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${script} 失败：\n${output.slice(-2000)}`))
    })
  })
}

/** 构建（BASE_PATH 留空，服务根就是站点根） */
async function build() {
  // prebuild 只生成 styles/fonts.css，这里手动跑一遍，等价于 npm run build
  await runNode(path.join(root, 'scripts/gen-fonts-css.mjs'), { BASE_PATH: '' })
  await runNode(path.join(root, 'node_modules/astro/bin/astro.mjs'), {
    BASE_PATH: '',
    SITE_URL: process.env.SITE_URL ?? 'http://127.0.0.1',
  })
}

/** 从 dist 里读路由（每个 index.html 一个） */
async function routes() {
  const found = []
  async function walk(dir, prefix) {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith('_') || entry.name === 'fonts' || entry.name.startsWith('.')) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(full, `${prefix}${entry.name}/`)
      } else if (entry.name === 'index.html') {
        found.push(prefix)
      }
    }
  }
  await walk(dist, '/')
  return found.sort()
}

function serve() {
  const server = createServer(async (request, response) => {
    const url = decodeURIComponent((request.url ?? '/').split('?')[0])
    let file = path.join(dist, url)
    try {
      const info = await stat(file)
      if (info.isDirectory()) file = path.join(file, 'index.html')
    } catch {
      response.writeHead(404)
      response.end('not found')
      return
    }
    response.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' })
    createReadStream(file).pipe(response)
  })
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }))
  })
}

async function launchChrome() {
  const executable = findChrome()
  if (!executable) throw new Error('找不到 Chrome，设 CHROME_PATH 环境变量指向可执行文件')

  // 每次用全新的临时 profile：复用同一个目录时，上一次没退干净的实例会把新进程「接管」掉，
  // 表现就是调试端口一直不打开。
  const profile = await mkdtemp(path.join(tmpdir(), 'jt-shots-'))
  const port = 9500 + Math.floor(Math.random() * 400)
  const child = spawn(
    executable,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      `--remote-debugging-port=${port}`,
      '--user-data-dir=' + profile,
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'], detached: false },
  )

  // 调试端口打不开时，唯一有用的线索就是 Chrome 自己的 stderr
  let stderr = ''
  child.stderr?.on('data', (chunk) => {
    stderr += chunk
    if (stderr.length > 4000) stderr = stderr.slice(-4000)
  })

  return { child, port, profile, getStderr: () => stderr }
}

async function waitForDevtools(port) {
  for (let attempt = 0; attempt < 150; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (response.ok) return
    } catch {
      /* 还没起来 */
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error('Chrome 的调试端口没有起来')
}

async function pageTarget(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/list`)
  const targets = await response.json()
  const page = targets.find((target) => target.type === 'page')
  if (!page) throw new Error('没有可用的页面 target')
  return page.webSocketDebuggerUrl
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url)
    const pending = new Map()
    let id = 0

    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)
      if (message.id && pending.has(message.id)) {
        const { resolve: done, reject: fail } = pending.get(message.id)
        pending.delete(message.id)
        if (message.error) fail(new Error(message.error.message))
        else done(message.result)
      }
    })
    socket.addEventListener('error', reject)
    socket.addEventListener('open', () =>
      resolve({
        send(method, params = {}) {
          id += 1
          const current = id
          return new Promise((done, fail) => {
            pending.set(current, { resolve: done, reject: fail })
            socket.send(JSON.stringify({ id: current, method, params }))
          })
        },
        close: () => socket.close(),
      }),
    )
  })
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  })
  return result.result?.value
}

async function load(client, url) {
  await client.send('Page.navigate', { url })
  // 等 load 事件后再多等一会儿，字体与图片解码都需要时间
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const ready = await evaluate(client, 'document.readyState')
    if (ready === 'complete') break
    await wait(100)
  }
  await wait(250)
}

async function main() {
  const chrome = findChrome()
  if (!chrome) throw new Error('找不到 Chrome，设 CHROME_PATH 环境变量指向可执行文件')

  console.log('→ 构建')
  await build()

  let list = await routes()
  if (only) list = list.filter((route) => route.includes(only))
  if (list.length === 0) throw new Error('dist 里没有找到任何页面')

  const outDir = path.join(root, '.impeccable/shots', stamp())
  await mkdir(outDir, { recursive: true })

  const { server, port: httpPort } = await serve()
  const { child, port: debugPort, profile, getStderr } = await launchChrome()

  const problems = []
  const shots = []

  try {
    try {
      await waitForDevtools(debugPort)
    } catch (error) {
      throw new Error(`${error.message}\nChrome 输出：${getStderr().slice(-800) || '（空）'}`)
    }
    const client = await connect(await pageTarget(debugPort))
    await client.send('Page.enable')
    await client.send('Runtime.enable')

    for (const route of list) {
      const themes = ['dark']
      if (extraLight && route === '/') themes.push('light')

      for (const theme of themes) {
        for (const width of VIEWPORTS) {
          await client.send('Emulation.setDeviceMetricsOverride', {
            width,
            height: width === 390 ? 844 : 900,
            deviceScaleFactor: 1,
            mobile: width < 500,
          })

          // 主题靠 localStorage，必须在导航前写好
          await load(client, `http://127.0.0.1:${httpPort}/`)
          await evaluate(client, `localStorage.setItem('theme', ${JSON.stringify(theme)})`)
          await load(client, `http://127.0.0.1:${httpPort}${route}`)

          // 触发懒加载：逐屏滚到底再回顶部
          await evaluate(
            client,
            `(async () => {
              const step = window.innerHeight * 0.9
              for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
                window.scrollTo(0, y)
                await new Promise((r) => setTimeout(r, 90))
              }
              window.scrollTo(0, 0)
              await document.fonts.ready
              // 懒加载的图即使已经下载，也可能还没解码成位图；全页截图会把没解码的图拍成黑块
              await Promise.all(
                [...document.images].map(async (img) => {
                  img.loading = 'eager'
                  if (!img.complete) {
                    await new Promise((done) => {
                      img.addEventListener('load', done, { once: true })
                      img.addEventListener('error', done, { once: true })
                    })
                  }
                  try {
                    await img.decode()
                  } catch {
                    /* 解码失败交给下面的 broken 检测 */
                  }
                }),
              )
              await new Promise((r) => setTimeout(r, 200))
            })()`,
          )

          const metrics = await evaluate(
            client,
            `(() => {
              const doc = document.documentElement
              const broken = [...document.images]
                .filter((img) => img.complete && img.naturalWidth === 0)
                .map((img) => img.currentSrc || img.src)
              return {
                height: Math.ceil(doc.scrollHeight),
                scrollWidth: doc.scrollWidth,
                clientWidth: doc.clientWidth,
                broken,
              }
            })()`,
          )

          if (metrics.broken.length > 0) {
            problems.push(`${route} @${width} ${theme}：${metrics.broken.length} 张图没加载出来 → ${metrics.broken.join(', ')}`)
          }
          if (metrics.scrollWidth > metrics.clientWidth + 1) {
            problems.push(
              `${route} @${width} ${theme}：横向滚动 ${metrics.scrollWidth}px > ${metrics.clientWidth}px`,
            )
          }

          const clip = {
            x: 0,
            y: 0,
            width,
            height: Math.min(metrics.height, MAX_HEIGHT),
            scale: 1,
          }
          // captureBeyondViewport 在很长的页面上会把视口外的图片拍成黑块（合成器没光栅化），
          // 所以改成先把视口撑到整页高度，让所有内容都真的在视口里，再截。
          await client.send('Emulation.setDeviceMetricsOverride', {
            width,
            height: clip.height,
            deviceScaleFactor: 1,
            mobile: width < 500,
          })
          await new Promise((resolve) => setTimeout(resolve, 250))
          const shot = await client.send('Page.captureScreenshot', {
            format: 'png',
            captureBeyondViewport: false,
            clip,
          })

          const name = route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/\//g, '-')
          const suffix = theme === 'light' ? `-light-${width}` : `-${width}`
          const file = path.join(outDir, `${name}${suffix}.png`)
          await writeFile(file, Buffer.from(shot.data, 'base64'))
          shots.push({
            file: path.relative(root, file).split(path.sep).join('/'),
            size: `${width}×${clip.height}`,
          })
          console.log(`  ${path.basename(file)}  ${width}×${clip.height}  ${theme}`)
        }
      }
    }

    client.close()
  } finally {
    server.close()
    // Windows 上 Chrome 退出后还会攥一会儿 profile 里的文件，直接 rm 会 EBUSY，
    // 所以先等进程真的结束，再重试几次删除。
    await new Promise((done) => {
      const timer = setTimeout(done, 3000)
      child.once('exit', () => {
        clearTimeout(timer)
        done()
      })
      child.kill()
    })
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        await rm(profile, { recursive: true, force: true })
        break
      } catch {
        await new Promise((done) => setTimeout(done, 200))
      }
    }
  }

  console.log(`\n${shots.length} 张图 → ${path.relative(root, outDir).split(path.sep).join('/')}`)

  if (problems.length > 0) {
    console.error('\n发现问题：')
    for (const problem of problems) console.error(`  - ${problem}`)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
