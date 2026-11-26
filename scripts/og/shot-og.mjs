// @ts-check
// 固定尺寸截图：node ogshot.mjs <url> <outfile> [width] [height]
// 用于 OG 图（1200×630）这类不跟站点视口绑定的静态图。
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const url = process.argv[2];
const out = process.argv[3];
const W = Number(process.argv[4] ?? 1200);
const H = Number(process.argv[5] ?? 630);

if (!url || !out) {
  console.error('usage: node ogshot.mjs <url> <outfile> [w] [h]');
  process.exit(1);
}

const profile = mkdtempSync(join(tmpdir(), 'og-'));
const port = 9500 + Math.floor(Math.random() * 400);

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--user-data-dir=${profile}`,
    `--remote-debugging-port=${port}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(p) {
  for (let i = 0; i < 150; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}${p}`);
      if (r.ok) return await r.json();
    } catch {
      /* not up yet */
    }
    await sleep(200);
  }
  throw new Error(`CDP not ready: ${p}`);
}

/** @param {string} wsUrl */
function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  /** @type {Map<number, {resolve: (v: any) => void, reject: (e: Error) => void}>} */
  const pending = new Map();
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(String(e.data));
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) p?.reject(new Error(msg.error.message));
      else p?.resolve(msg.result);
    }
  });
  const ready = new Promise((resolve, reject) => {
    ws.addEventListener('open', () => resolve(null));
    ws.addEventListener('error', () => reject(new Error('ws error')));
  });
  return {
    ready,
    send(method, params = {}, sessionId) {
      return new Promise((resolve, reject) => {
        const myId = ++id;
        pending.set(myId, { resolve, reject });
        ws.send(JSON.stringify({ id: myId, method, params, sessionId }));
      });
    },
    close: () => ws.close(),
  };
}

const targets = await getJson('/json/list');
const page = targets.find((t) => t.type === 'page');
if (!page) throw new Error('no page target');

const cdp = connect(page.webSocketDebuggerUrl);
await cdp.ready;

await cdp.send('Page.enable');
await cdp.send('Emulation.setDeviceMetricsOverride', {
  width: W,
  height: H,
  deviceScaleFactor: 1,
  mobile: false,
});
await cdp.send('Page.navigate', { url });
await sleep(1200);
await cdp.send('Runtime.evaluate', {
  expression: 'document.fonts.ready.then(() => true)',
  awaitPromise: true,
  returnByValue: true,
});
await sleep(300);

const shot = await cdp.send('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: false,
  clip: { x: 0, y: 0, width: W, height: H, scale: 1 },
});

writeFileSync(out, Buffer.from(shot.data, 'base64'));
cdp.close();
chrome.kill();
console.log(`wrote ${out} (${W}x${H})`);
