import { defineConfig, devices } from '@playwright/test'

/**
 * End-to-end checks against a production build (docs/05 §11).
 *   npm run build && npm test
 * The web server runs with CONTACT_DRY_RUN=1, so the contact form never sends.
 * If Playwright's own browser isn't installed, set PLAYWRIGHT_CHROMIUM_PATH.
 */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined
const port = Number(process.env.TEST_PORT ?? 3210)

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    launchOptions: { executablePath, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
  ],
  webServer: {
    command: `node node_modules/next/dist/bin/next start -p ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    env: { CONTACT_DRY_RUN: '1' },
    timeout: 60_000,
  },
})
