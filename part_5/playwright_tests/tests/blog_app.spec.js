const { test, expect, beforeEach, describe } = require('@playwright/test')

//npm run test:report

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Teppo Testaaja',
        username: 'TestiTepi88',
        password: 'T€nttu88'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const header = await page.getByText('log in to application')
    await expect(header).toBeVisible()

    await expect(page.locator('[name="Username"]')).toBeVisible()
    await expect(page.locator('[name="Password"]')).toBeVisible()

    const login_button = await page.getByRole('button', { name: 'Login' })
    await expect(login_button).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await expect(page.getByText('log in to application')).toBeVisible()

      await expect(page.locator('[name="Username"]')).toBeVisible()
      await page.locator('[name="Username"]').fill('TestiTepi88')
      await expect(page.locator('[name="Password"]')).toBeVisible()
      await page.locator('[name="Password"]').fill('T€nttu88')

      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('Teppo Testaaja logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await expect(page.getByText('log in to application')).toBeVisible()

      await expect(page.locator('[name="Username"]')).toBeVisible()
      await page.locator('[name="Username"]').fill('TestiTepi89')
      await expect(page.locator('[name="Password"]')).toBeVisible()
      await page.locator('[name="Password"]').fill('T€nttu89')

      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('Wrong username or password!')).toBeVisible()
    })
  })
})