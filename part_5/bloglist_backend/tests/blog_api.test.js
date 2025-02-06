const { test, describe, after, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const { listWithMultipleUserBlogs } = require('./test_data')
const User = require('../models/user')

const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

// Execute all: npm run tests
// just this file: npm test ./tests/blog_api.test.js

let testToken  // Define testToken variable globally
let postedTestBlog  // Define global blog that will be used in Post & Delete tests

before(async () => {
  await User.deleteMany({})

  const testUser = {
    username: 'TeTe123',
    name: 'Teppo Testaaja',
    password: '1234'
  }

  await api
    .post('/api/users')
    .send(testUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const loginResponse = await api
    .post('/api/login')
    .send({ username: testUser.username, password: testUser.password })
    .expect(200)

  // Extract the token from response and assign to the global variable
  testToken = loginResponse.body.token

  // If token doesn't exist, log the error and terminate test execution
  if (!testToken) {
    console.log('Failed to get authorization token')
    process.exit(1)
  }
  else {
    console.log('Test token received')
  }
})

before(async () => {
  await Blog.deleteMany({})

  const blogObjects = listWithMultipleUserBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('HTTP Get tests:', () => {
  test('All blogs are returned in JSON format', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      // Verify correct format
      .expect('Content-Type', /application\/json/)
    // Verify the correct amount of blogs are returned
    assert.strictEqual(response.body.length, listWithMultipleUserBlogs.length)
  })

  test('Blogs have an id property instead of _id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
      // Verify the id property exists and _id does not
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })
})

describe('HTTP POST tests:', () => {
  test('A valid blog can be added to database', async () => {
    const getResponse = await api.get('/api/blogs')
    const blogsAtStart = getResponse.body

    const newBlog = {
      title: 'This is a valid blog',
      author: 'Unknown',
      url: 'validBlogs.com',
      likes: 0
    }
    const potsResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${testToken}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    postedTestBlog = potsResponse.body

    const finalResponse = await api.get('/api/blogs')
    const finalBlogs = finalResponse.body

    // Verify the total number of blogs has increased by one
    assert.strictEqual(finalBlogs.length, blogsAtStart.length + 1)
    // Verify that the content of the blog post is saved correctly to the database
    const blogAdded = finalBlogs.find(blog =>
      blog.title === newBlog.title &&
      blog.author === newBlog.author &&
      blog.url === newBlog.url &&
      blog.likes === newBlog.likes
    )
    assert(blogAdded)
  })

  test('Fails with 401 if authorization token is not provided', async () => {
    const getResponse = await api.get('/api/blogs')
    const blogsAtStart = getResponse.body

    const newBlog = {
      title: 'This is a valid blog',
      author: 'Unknown',
      url: 'validBlogs.com',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const finalResponse = await api.get('/api/blogs')
    const finalBlogs = finalResponse.body

    // Verify the total number of blogs has not increased
    assert.strictEqual(finalBlogs.length, blogsAtStart.length)
  })

  test('Likes default to 0 if missing from the request', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Mr Notliked',
      url: 'noLikesBlog.com'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${testToken}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Verify that the likes property is set to 0 by default
    assert.strictEqual(response.body.likes, 0)
  })

  test('Fails with status code 400 if title is not included', async () => {
    const getResponse = await api.get('/api/blogs')
    const blogsAtStart = getResponse.body

    const newBlog = {
      author: 'Todd  Titleton',
      url: 'noTitle.com',
      ikes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${testToken}` })
      .expect(400)

    const finalResponse = await api.get('/api/blogs')
    const finalBlogs = finalResponse.body

    // Verify the total number of blogs has not increased
    assert.strictEqual(finalBlogs.length, blogsAtStart.length)
  })

  test('Fails with status code 400 if url is not included', async () => {
    const getResponse = await api.get('/api/blogs')
    const blogsAtStart = getResponse.body

    const newBlog = {
      author: 'Mrs Nourl',
      title: 'Blog with no url',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${testToken}` })
      .expect(400)

    const finalResponse = await api.get('/api/blogs')
    const finalBlogs = finalResponse.body

    // Verify the total number of blogs has not increased
    assert.strictEqual(finalBlogs.length, blogsAtStart.length)
  })
})

describe('HTTP DELETE tests:', () => {
  test('Succeeds with status code 204 if id & token are valid', async () => {
    const getResponse = await api.get('/api/blogs')
    const blogsAtStart = getResponse.body

    await api
      .delete(`/api/blogs/${postedTestBlog.id}`)
      .set({ Authorization: `Bearer ${testToken}` })
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')

    // Verify the total number of blogs has decreased by one
    assert.strictEqual(blogsAtStart.length - 1, blogsAtEnd.body.length)
  })

  test('Fails with status code 403 if id & token valid but token lacks delete authorization', async () => {
    const getResponse = await api.get('/api/blogs')
    const blogsAtStart = getResponse.body
    const blog = getResponse.body.find(blog => blog.author === 'Robert C. Martin')

    const deleteResponse = await api
      .delete(`/api/blogs/${blog.id}`)
      .set({ Authorization: `Bearer ${testToken}` })
      .expect(403)

    const blogsAtEnd = await api.get('/api/blogs')

    // Verify Error message
    assert.strictEqual(deleteResponse.body.error, 'Forbidden: You have no rights to delete this blog')
    // Verify the total number of blogs has decreased by one
    assert.strictEqual(blogsAtStart.length, blogsAtEnd.body.length)
  })

  test('Fails with status code 400 if id is invalid', async () => {
    const getResponse = await api.get('/api/blogs')
    const blogsAtStart = getResponse.body

    const invalidId = 'invalidId123'

    const response = await api
      .delete(`/api/blogs/${invalidId}`)
      .set({ Authorization: `Bearer ${testToken}` })
      .expect(400)

    const blogsAtEnd = await api.get('/api/blogs')

    // Verify the total number of blogs has remained the same
    assert.strictEqual(blogsAtStart.length, blogsAtEnd.body.length)
    assert.strictEqual(response.body.error, 'Cast to ObjectId failed for value "invalidId123" (type string) at path "_id" for model "Blog"')
  })

  test('Fails with status code 404 if no id is provided', async () => {
    const getResponse = await api.get('/api/blogs')
    const blogsAtStart = getResponse.body

    const noId = ''
    await api
      .delete(`/api/blogs/${noId}`)
      .set({ Authorization: `Bearer ${testToken}` })
      .expect(404)

    const blogsAtEnd = await api.get('/api/blogs')

    // Verify the total number of blogs has remained the same
    assert.strictEqual(blogsAtStart.length, blogsAtEnd.body.length)
  })
})

describe('HTTP PUT tests:', () => {
  test('Update the like count if id and new likes value are valid', async () => {
    const blogs = await api.get('/api/blogs')
    const blogToUpdate = blogs.body[0]
    const newLikes = 99

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: newLikes })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = response.body

    // Verify the updated like count is equal to the newLikes
    assert.strictEqual(updatedBlog.likes, newLikes)
  })

  test('Fails with status code 400 if id is invalid', async () => {
    const invalidId = 'invalidId123'
    const newLikes = 99

    const response = await api
      .put(`/api/blogs/${invalidId}`)
      .send({ likes: newLikes })
      .expect(400)

    // Verify error message
    assert.strictEqual(response.body.error, 'Cast to ObjectId failed for value "invalidId123" (type string) at path "_id" for model "Blog"')
  })

  test('Fails with status code 404 if no id is provided', async () => {
    const getResponse = await api.get('/api/blogs')
    const blogsAtStart = getResponse.body

    const noId = ''
    const newLikes = 99
    await api
      .put(`/api/blogs${noId}`)
      .send({ likes: newLikes })
      .expect(404)

    const blogsAtEnd = await api.get('/api/blogs')

    // Verify the total number of blogs has remained the same
    assert.strictEqual(blogsAtStart.length, blogsAtEnd.body.length)
  })

  test('Fails with 400 if new likes value is invalid', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]
    const invalidLikes = 'nine'

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: invalidLikes })
      .expect(400)

    // Verify error message
    assert.strictEqual(response.body.error, 'Cast to Number failed for value "nine" (type string) at path "likes"')
  })
})

after(async () => {
  await mongoose.connection.close()
})