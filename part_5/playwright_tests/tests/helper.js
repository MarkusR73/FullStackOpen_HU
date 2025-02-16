const { expect } = require('@playwright/test')

const loginWith = async (page, username, password)  => {
  await page.locator('[name="Username"]').fill(username)
  await page.locator('[name="Password"]').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'New blog' }).click()
  await page.locator('[name="Title"]').fill(title)
  await page.locator('[name="Author"]').fill(author)
  await page.locator('[name="Url"]').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const verifyNotification = async (page, type, message, borderStyle, color) => {
  const notification = page.locator(type)
  await expect(notification).toBeVisible() 
  await expect(notification).toContainText(message)
  await expect(notification).toHaveCSS('border-style', borderStyle)
  await expect(notification).toHaveCSS('color', color)
  await expect(notification).toBeHidden()
}

const createUser = async (request, name, username, password) => {
  await request.post('http://localhost:3003/api/users', {
    data: {
      name: name,
      username: username,
      password: password
    }
  })
}

const getLikes = async (blog) => {
  const likeElement = blog.locator('.blog-likes')
  const likesText = await likeElement.textContent()
  return parseInt(likesText.replace('Likes: ', ''), 10)
}

export { loginWith, createBlog, verifyNotification, createUser, getLikes }