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
    test('Succeeds with correct credentials', async ({ page }) => {
      await expect(page.getByText('log in to application')).toBeVisible()

      await expect(page.locator('[name="Username"]')).toBeVisible()
      await page.locator('[name="Username"]').fill('TestiTepi88')
      await expect(page.locator('[name="Password"]')).toBeVisible()
      await page.locator('[name="Password"]').fill('T€nttu88')

      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('Teppo Testaaja logged in')).toBeVisible()
    })

    test('Fails with wrong credentials', async ({ page }) => {
      await expect(page.getByText('log in to application')).toBeVisible()

      await expect(page.locator('[name="Username"]')).toBeVisible()
      await page.locator('[name="Username"]').fill('TestiTepi89')
      await expect(page.locator('[name="Password"]')).toBeVisible()
      await page.locator('[name="Password"]').fill('T€nttu89')

      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.locator('.error')).toContainText('Wrong username or password!')
      await expect(page.locator('.error')).toHaveCSS('border-style', 'solid')
      await expect(page.locator('.error')).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Teppo Testaaja logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await expect(page.getByText('log in to application')).toBeVisible()
      await page.locator('[name="Username"]').fill('TestiTepi88')
      await page.locator('[name="Password"]').fill('T€nttu88')
      await page.getByRole('button', { name: 'Login' }).click()
      await expect(page.getByText('Teppo Testaaja logged in')).toBeVisible()
    })
  
    test('A new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'New blog' }).click()

      await expect(page.locator('[name="Title"]')).toBeVisible()
      await page.locator('[name="Title"]').fill('Testataan blogin luontia')

      await expect(page.locator('[name="Author"]')).toBeVisible()
      await page.locator('[name="Author"]').fill('Jooseppi')

      await expect(page.locator('[name="Url"]')).toBeVisible()
      await page.locator('[name="Url"]').fill('www.tepi-testaa.fi')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('A new blog "Testataan blogin luontia" by Jooseppi added!')).toBeVisible()
      await expect(page.getByText('Testataan blogin luontia, by Jooseppi')).toBeVisible()
      await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
    })

    test('Existing blog can be liked', async ({ page }) => {
      // Create blog
      await page.getByRole('button', { name: 'New blog' }).click()
      await page.locator('[name="Title"]').fill('Testataan blogin tykkäämistä')
      await page.locator('[name="Author"]').fill('Jooseppi')
      await page.locator('[name="Url"]').fill('www.tepi-testaa.fi')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('A new blog "Testataan blogin tykkäämistä" by Jooseppi added!')).toBeVisible()

      // Like created blog
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('Likes: 0')).toBeVisible()
      await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('Likes: 1')).toBeVisible()
    })

    test('Existing blog can be deleted by the user who added it', async ({ page }) => {
      // Create blog
      await page.getByRole('button', { name: 'New blog' }).click()
      await page.locator('[name="Title"]').fill('Testataan blogin poistamista')
      await page.locator('[name="Author"]').fill('Jooseppi')
      await page.locator('[name="Url"]').fill('www.tepi-testaa.fi')
      await page.getByRole('button', { name: 'create' }).click()

      const notification = page.locator('.notification')

      await expect(notification).toHaveText('A new blog "Testataan blogin poistamista" by Jooseppi added!')
      await expect(notification).toBeHidden()

      // Delete created blog
      
      await page.getByRole('button', { name: 'view' }).click()
      // Set up dialog listener before triggering the dialog
      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        await dialog.accept() 
      })
      await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
      await page.getByRole('button', { name: 'delete' }).click()

      // Verify delete process is successful
      await expect(notification).toHaveText('Blog deleted successfully!')
      await expect(page.getByText('Testataan blogin poistamista')).not.toBeVisible()
    })
  })
})