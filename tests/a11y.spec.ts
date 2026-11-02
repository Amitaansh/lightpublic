import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

async function settle(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.waitForFunction(() => {
    const l = document.querySelector('.loader')
    return !l || l.getAttribute('data-state') === 'done'
  }, null, { timeout: 10000 })
  await page.waitForTimeout(1300)
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
  await page.getByRole('link', { name: 'Contact' }).first().click()
  await expect(page.getByRole('dialog', { name: 'Get in touch' })).toBeVisible()
  await page.waitForTimeout(900)
  const results = await new AxeBuilder({ page }).withTags(WCAG).include('dialog').analyze()
  expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
})

test('the film is fully described for screen readers, in order', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('main h1')).toHaveCount(1)
  const titles = await page.locator('main section h2').allTextContents()
  expect(titles).toEqual([
    'The baton, up close',
    'Pick it up',
    'How to hold it',
    'Clips onto your cane',
    'Feel where it is',
    'Remembers your routes',
    'STOP',
    'Inside the baton',
    'Be your light',
  ])
  await expect(page.locator('#vibration p')).toContainText('A ring of small motors inside the grip vibrates on the side of each obstacle')
})
