const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const header = await page.getByText('log in to application')
    await expect(header).toBeVisible()

    const username_field = await page.getByLabel('Username')
    const password_field = await page.getByLabel('Password')
    await expect(username_field).toBeVisible
    await expect(password_field).toBeVisible

    const login_button = await page.getByRole('button', { name: 'Login' })
    await expect(login_button).toBeVisible()
  })
})