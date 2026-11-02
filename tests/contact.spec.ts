import { expect, test } from '@playwright/test'

test('contact dialog: open, validate, send, close', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.getByRole('link', { name: 'Contact' }).first().click()
  const dialog = page.getByRole('dialog', { name: 'Get in touch' })
  await expect(dialog).toBeVisible()
  await expect(page).toHaveURL(/\/contact$/)
  await expect(page.getByLabel('Your email')).toBeFocused()

  // Empty submit: the error is tied to the field and focus goes back to it.
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.getByLabel('Your email')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.locator('#contact-email-error')).toContainText('Enter an email address')
  await expect(page.getByLabel('Your email')).toBeFocused()

  // Valid submit (dry run on the server), after the 3 s spam window.
  await page.getByLabel('Your email').fill('reader@example.com')
  await page.getByLabel('Message (optional)').fill('Hello from a test.')
  await page.waitForTimeout(3200)
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.getByRole('heading', { name: 'Message sent' })).toBeFocused()

  // Esc closes the dialog and returns to the page.
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(page).toHaveURL(/\/$/)
})

test('honeypot submissions are dropped silently', async ({ page }) => {
  await page.goto('/contact')
  await page.waitForLoadState('networkidle')
  await page.getByLabel('Your email').fill('bot@example.com')
  await page.locator('#contact-company').evaluate((el: HTMLInputElement) => (el.value = 'spam'))
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.getByRole('heading', { name: 'Message sent' })).toBeVisible()
})
