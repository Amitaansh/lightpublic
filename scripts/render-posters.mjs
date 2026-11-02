// Renders one still per film scene from the live 3D scene (static tier, no-JS).
//
//   npm run build
//   npm run posters
//
// Starts `next start` with POSTER_MODE=1 (through process.execPath, never
// spawn("npm"); see AGENTS.md §8), opens /poster?t=… for each scene's key
// moment, and writes WebP files to
// public/posters/. If Playwright's own browser isn't
// installed, set PLAYWRIGHT_CHROMIUM_PATH to a Chromium executable.

import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const port = Number(process.env.POSTER_PORT ?? 3199)
const base = `http://127.0.0.1:${port}`

/** One still per scene (film units, see content/film.ts), for the static tier and no-JS. */
const POSTERS = [
  ['title', 40],
  ['macro', 205],
  ['hand', 610],
  ['hold', 700],
  ['clip', 1000],
  ['vibration', 1250],
  ['route', 1620],
  ['stop', 1830],
  ['inside', 2150],
  ['finale', 2560],
]

function startServer() {
  const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next')
  const child = spawn(process.execPath, [nextBin, 'start', '-p', String(port)], {
    cwd: root,
    env: { ...process.env, POSTER_MODE: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  child.stderr.on('data', (d) => process.stderr.write(d))
  return child
}

function stopTree(child) {
  if (!child.pid) return
  if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
  else child.kill('SIGTERM')
}

async function waitFor(url, ms = 30000) {
  const end = Date.now() + ms
  while (Date.now() < end) {
    try {
      const r = await fetch(url)
      if (r.ok || r.status === 404) return
    } catch {}
    await new Promise((r) => setTimeout(r, 400))
  }
  throw new Error(`Server did not start at ${url}`)
}

async function shoot(browser, t, width, height, outFile) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  await page.goto(`${base}/poster?t=${t}`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => document.documentElement.dataset.posterReady === '1', null, { timeout: 30000 })
  const png = await page.screenshot()
  await page.close()
  await sharp(png).webp({ quality: 80 }).toFile(outFile)
  console.log('wrote', path.relative(root, outFile))
}

const server = startServer()
try {
  await waitFor(`${base}/poster?t=0`)
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  })
  mkdirSync(path.join(root, 'public', 'posters'), { recursive: true })
  for (const [name, t] of POSTERS) await shoot(browser, t, 1600, 1000, path.join(root, 'public', 'posters', `${name}.webp`))
  await browser.close()
} finally {
  stopTree(server)
}
