// Renders the static-tier posters and the gallery renders from the live 3D scene.
//
//   npm run build
//   npm run posters
//
// Starts `next start` with POSTER_MODE=1 (through process.execPath, never
// spawn("npm"); see AGENTS.md §8), opens /poster?name=… for each state in a
// square frame with a transparent background, and writes WebP files to
// public/posters/ and public/media/. If Playwright's own browser isn't
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

const POSTERS = [
  'hero',
  'what-it-adds',
  'cane',
  'reliability-0',
  'reliability-1',
  'reliability-2',
  'reliability-3',
  'reliability-4',
  'guide-notes',
  'route-memory',
  'haptics',
  'stop',
  'inside',
  'mockups',
  'prototype',
  'why',
  'timeline',
  'contact-cta',
  'about',
]
const GALLERY = [
  { name: 'gallery-exploded', file: 'render-exploded', width: 960, height: 1200 },
  { name: 'gallery-grip', file: 'render-grip', width: 960, height: 1200 },
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

async function shoot(browser, name, width, height, outFile) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  await page.goto(`${base}/poster?name=${encodeURIComponent(name)}`, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => document.documentElement.dataset.posterReady === '1', null, { timeout: 30000 })
  const png = await page.screenshot({ omitBackground: true })
  await page.close()
  await sharp(png).webp({ quality: 84, alphaQuality: 90 }).toFile(outFile)
  console.log('wrote', path.relative(root, outFile))
}

const server = startServer()
try {
  await waitFor(`${base}/poster?name=hero`)
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  })
  mkdirSync(path.join(root, 'public', 'posters'), { recursive: true })
  mkdirSync(path.join(root, 'public', 'media'), { recursive: true })
  for (const name of POSTERS) await shoot(browser, name, 900, 900, path.join(root, 'public', 'posters', `${name}.webp`))
  for (const g of GALLERY) await shoot(browser, g.name, g.width, g.height, path.join(root, 'public', 'media', `${g.file}.webp`))
  await browser.close()
} finally {
  stopTree(server)
}
