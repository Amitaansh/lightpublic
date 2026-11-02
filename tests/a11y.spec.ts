import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

async function settle(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.waitForFunction(() => {
    const l = document.querySelector('.loader')
    return !l || l.getAttribute('data-state') === 'done'
  }, null, { timeout: 8000 })
  await page.waitForTimeout(600)
}

for (const path of ['/', '/about', '/contact']) {
  test(`no WCAG 2.2 AA violations on ${path} @mobile`, async ({ page }) => {
    await page.goto(path)
    await settle(page)
    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze()
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.length} × ${v.help} → ${v.nodes[0]?.target}`)).toEqual([])
  })
}

test('no WCAG violations with the contact dialog open', async ({ page }) => {
  await page.goto('/')
  await settle(page)
  await page.getByRole('link', { name: 'Get in touch' }).first().click()
  await expect(page.getByRole('dialog', { name: 'Get in touch' })).toBeVisible()
  await page.waitForTimeout(700) // let the open animation finish
  const results = await new AxeBuilder({ page }).withTags(WCAG).include('dialog').analyze()
  expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
})

test('one h1, and chapters in story order', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('main h1')).toHaveCount(1)
  const titles = await page.locator('main section[data-chapter] h2[id$="-title"]').allTextContents()
  expect(titles.slice(0, 3)).toEqual([
    'Your cane finds the ground. L.I.G.H.T looks further.',
    'Clips onto the cane you already trust.',
    'Never fails silently.',
  ])
})
