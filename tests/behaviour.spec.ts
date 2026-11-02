import { expect, test } from '@playwright/test'

test('skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
})

test('Lights out button switches the room lights', async ({ page }) => {
  await page.goto('/')
  const btn = page.getByRole('button', { name: /Lights out/ })
  await expect(btn).toHaveAttribute('aria-pressed', 'false')
  await btn.click()
  await expect(btn).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('html')).toHaveAttribute('data-lights', 'out')
})

test('scrolling moves the film; the closing buttons appear at the end', async ({ page }) => {
  await page.goto('/?t=0.99')
  await page.waitForTimeout(2500)
  const close = page.locator('.title-card--close')
  await expect(close).toHaveAttribute('data-inert', 'false')
  await expect(page.getByRole('link', { name: 'Get in touch' }).last()).toBeVisible()
})

test('keyboard focus on the closing buttons brings the end of the film into view', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1500)
  await page.getByRole('link', { name: 'About the project' }).focus()
  await page.waitForTimeout(1500)
  const atEnd = await page.evaluate(() => window.scrollY + window.innerHeight >= document.querySelector('.film > div')!.getBoundingClientRect().bottom + window.scrollY - 2)
  expect(atEnd).toBe(true)
})

test('motion off shows still frames instead of the 3D film', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(1500)
  await page.getByRole('button', { name: /Motion/ }).click()
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off')
  await expect(page.locator('.scene-layer')).toHaveCount(0)
  await expect(page.locator('.film__poster img')).toHaveAttribute('src', /\/posters\/\w+\.webp/)
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

  test('the film degrades to stills, and the loader is hidden', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.loader')).toBeHidden()
    await expect(page.locator('img.film__noscript-poster')).toHaveCount(10)
    await expect(page.getByRole('link', { name: 'Get in touch' }).last()).toBeVisible()
  })

  test('the contact form posts without JavaScript', async ({ page }) => {
    await page.goto('/contact')
    await page.getByLabel('Your email').fill('nojs@example.com')
    await page.getByRole('button', { name: 'Send' }).click()
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
