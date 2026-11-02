import { expect, test } from '@playwright/test'

test('skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
})

test('fallback ladder works by keyboard', async ({ page }) => {
  await page.goto('/#reliability')
  await page.getByRole('tab', { name: /Full/ }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab', { name: /Reduced/ })).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('End')
  await expect(page.getByRole('tab', { name: /Cane/ })).toBeFocused()
  await expect(page.getByRole('tabpanel')).toContainText('your cane still works')
})

test('haptics demo announces where the grip vibrates', async ({ page }) => {
  await page.goto('/#haptics')
  await page.getByRole('radio', { name: 'Right', exact: true }).check()
  await expect(page.locator('.live-text')).toContainText('Pole, right, close: the right side of the grip vibrates strongly.')
})

test('inside: each part opens its description', async ({ page }) => {
  await page.goto('/#inside')
  const btn = page.getByRole('button', { name: 'Independent safety-core chip' })
  await btn.click()
  await expect(btn).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('#hs-detail-safety')).toBeVisible()
})

test('motion toggle turns the 3D scene off and shows posters', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1500)
  await page.getByRole('button', { name: /Motion: on/ }).click()
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off')
  await expect(page.locator('.scene-layer')).toHaveCount(0)
  await expect(page.locator('img.poster').first()).toBeAttached()
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })
  test('defaults to motion off: no canvas, no smooth scroll @mobile', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'off')
    await page.waitForTimeout(1200)
    await expect(page.locator('.scene-layer')).toHaveCount(0)
    await expect(page.locator('html.lenis')).toHaveCount(0)
  })
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('all content is there and the loader is hidden', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.loader')).toBeHidden()
    await expect(page.getByRole('heading', { name: 'Never fails silently.' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Where we are.' })).toBeVisible()
  })

  test('the contact form posts without JavaScript', async ({ page }) => {
    await page.goto('/contact')
    await page.getByLabel('Your email').fill('nojs@example.com')
    await page.getByRole('button', { name: 'Send' }).click()
    await expect(page.getByText('nojs@example.com')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Message sent' })).toBeVisible()
  })
})

test('mobile: no horizontal overflow @mobile', async ({ page }) => {
  for (const path of ['/', '/about', '/contact']) {
    await page.goto(path)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, path).toBeLessThanOrEqual(0)
  }
})
