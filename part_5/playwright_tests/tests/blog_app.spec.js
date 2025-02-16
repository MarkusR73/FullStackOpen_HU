const { test, expect, beforeEach, describe } = require('@playwright/test')
import { loginWith, createBlog, verifyNotification, createUser, getLikes } from './helper.js'

//npm run test:report

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await createUser(request, 'Teppo Testaaja', 'TestiTepi88', 'T€nttu88')
    await createUser(request, 'Matti Meikäläinen', 'MasaM89', 'M@tt189')
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const header = await page.getByText('log in to application')
    await expect(page.getByText('log in to application')).toBeVisible()

    await expect(page.locator('[name="Username"]')).toBeVisible()
    await expect(page.locator('[name="Password"]')).toBeVisible()

    const login_button = await page.getByRole('button', { name: 'Login' })
    await expect(login_button).toBeVisible()
  })

  describe('Login', () => {
    test('Succeeds with correct credentials', async ({ page }) => {
      await expect(page.getByText('log in to application')).toBeVisible()
      await loginWith(page, 'TestiTepi88', 'T€nttu88')
      await verifyNotification(page, '.notification', 'Login successful!', 'solid', 'rgb(0, 128, 0)')
      await expect(page.getByText('Teppo Testaaja logged in')).toBeVisible()
    })

    test('Fails with wrong credentials', async ({ page }) => {
      await expect(page.getByText('log in to application')).toBeVisible()
      await loginWith(page, 'TestiTepi89', 'T€nttu89')
      await verifyNotification(page, '.error', 'Wrong username or password!', 'solid', 'rgb(255, 0, 0)')
      await expect(page.getByText('Teppo Testaaja logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await expect(page.getByText('log in to application')).toBeVisible()
      await loginWith(page, 'TestiTepi88', 'T€nttu88')
      await expect(page.getByText('Teppo Testaaja logged in')).toBeVisible()
    })
  
    test('A new blog can be created', async ({ page }) => {
      await createBlog(page, 'Testataan blogin luontia', 'Jooseppi', 'www.tepi-testaa.fi')
      await verifyNotification(page, '.notification', 'A new blog "Testataan blogin luontia" by Jooseppi added!', 'solid', 'rgb(0, 128, 0)') 
      await expect(page.getByText('Testataan blogin luontia, by Jooseppi')).toBeVisible()
    })

    describe('Operations on existing blogs', () => {
      let blog1, blog2, blog3

      beforeEach(async ({ page }) => {
        await createBlog(page, 'Testataan blogin toimintoja', 'Jooseppi', 'www.tepi-testaa.fi')
        await verifyNotification(page, '.notification', 'A new blog "Testataan blogin toimintoja" by Jooseppi added!', 'solid', 'rgb(0, 128, 0)')  
        blog1 = page.locator('.blog:has-text("Testataan blogin toimintoja")')
      })

      test('Existing blog can be liked', async ({ page }) => {
        await blog1.getByRole('button', { name: 'view' }).click()
        const likesBefore = await getLikes(blog1)
        await blog1.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(100)
        const likesAfter = await getLikes(blog1)
        expect(likesAfter).toBe(likesBefore + 1)
      })

      test('Existing blog can be deleted by the user who added it', async ({ page }) => {
        await blog1.getByRole('button', { name: 'view' }).click()
        // Set up dialog listener before triggering the dialog
        page.on('dialog', async dialog => {
          expect(dialog.type()).toBe('confirm')
          await dialog.accept() 
        })
        await blog1.getByRole('button', { name: 'delete' }).click()

        // Verify delete process is successful
        await verifyNotification(page, '.notification', 'Blog deleted successfully!', 'solid', 'rgb(0, 128, 0)')
        await expect(page.getByText('Testataan blogin toimintoja')).not.toBeVisible()
      })

      test('Only the user who added the blog sees the delete button', async ({ page }) => {
        // Verify that delete button is visible for Teppo Testaaja
        await blog1.getByRole('button', { name: 'view' }).click()
        await expect(blog1.getByRole('button', { name: 'delete' })).toBeVisible()

        // Log out user Teppo Testaaja
        await page.getByRole('button', { name: 'logout' }).click()
	      await expect(page.getByText('log in to application')).toBeVisible()

        // Log in as Matti Meikäläinen
        await loginWith(page, 'MasaM89', 'M@tt189')
        await expect(page.getByText('Matti Meikäläinen logged in')).toBeVisible()

        // Ensure that delete button is not visible
        await blog1.getByRole('button', { name: 'view' }).click()
        await expect(blog1.getByRole('button', { name: 'hide' })).toBeVisible()
        await expect(blog1.getByRole('button', { name: 'delete' })).not.toBeVisible()
      })

      test('Blogs are ordered by number of likes in descending order', async ({ page }) => {
        await createBlog(page, 'Toinen testi blogi', 'Toope', 'www.tt.fi')
        await verifyNotification(page, '.notification', 'A new blog "Toinen testi blogi" by Toope added!', 'solid', 'rgb(0, 128, 0)')  
        blog2 = page.locator('.blog:has-text("Toinen testi blogi")')
        await createBlog(page, 'Kolmonen', 'Jape', 'www.ivsmo.fi')
        await verifyNotification(page, '.notification', 'A new blog "Kolmonen" by Jape added!', 'solid', 'rgb(0, 128, 0)')  
        blog3 = page.locator('.blog:has-text("Kolmonen")')

        await blog1.getByRole('button', { name: 'view' }).click()
        await blog1.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(100)
        const likes1 = await getLikes(blog1)
        expect(likes1).toBe(1)

        await blog2.getByRole('button', { name: 'view' }).click()
        await blog2.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(100)
        await blog2.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(100)
        const likes2 = await getLikes(blog2)
        expect(likes2).toBe(2)

        await blog3.getByRole('button', { name: 'view' }).click()
        await blog3.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(100)
        await blog3.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(100)
        await blog3.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(100)
        const likes3 = await getLikes(blog3)
        expect(likes3).toBe(3)

        const blogElements = await page.locator('.blog').allTextContents()

        expect(blogElements[0]).toContain('Kolmonen')  
        expect(blogElements[1]).toContain('Toinen testi blogi') 
        expect(blogElements[2]).toContain('Testataan blogin toimintoja')
      })
    })
  })
})