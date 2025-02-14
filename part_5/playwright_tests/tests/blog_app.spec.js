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
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Meikäläinen',
        username: 'MasaM89',
        password: 'M@tt189'
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
    describe('Operations on existing blog', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'New blog' }).click()
        await page.locator('[name="Title"]').fill('Testataan blogin toimintoja')
        await page.locator('[name="Author"]').fill('Jooseppi')
        await page.locator('[name="Url"]').fill('www.tepi-testaa.fi')
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page.locator('.notification')).toHaveText('A new blog "Testataan blogin toimintoja" by Jooseppi added!')
        await expect(page.locator('.notification')).toBeHidden()
      })

      test('Existing blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('Likes: 0')).toBeVisible()
        await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('Likes: 1')).toBeVisible()
      })

      test('Existing blog can be deleted by the user who added it', async ({ page }) => {
        const notification = page.locator('.notification')
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
        await expect(page.getByText('Testataan blogin toimintoja')).not.toBeVisible()
      })

      test('Only the user who added the blog sees the delete button', async ({ page }) => {
        // Verify that delete button is visible for Teppo Testaaja
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()

        // Log out user Teppo Testaaja
        await page.getByRole('button', { name: 'logout' }).click()
	      await expect(page.getByText('log in to application')).toBeVisible()

        // Log in as Matti Meikäläinen
        await page.locator('[name="Username"]').fill('MasaM89');
        await page.locator('[name="Password"]').fill('M@tt189');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('Matti Meikäläinen logged in')).toBeVisible()

        // Ensure that delete button si not visible
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'hide' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
      })
    })
  })
})