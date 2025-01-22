const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const dummy = require('../utils/list_helper').dummy
const totalLikes = require('../utils/list_helper').totalLikes
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const mostBlogs = require('../utils/list_helper').mostBlogs
const mostLikes = require('../utils/list_helper').mostLikes
const { listWithOneBlog, listWithMultipleBlogs } = require('./test_data')

const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = listWithMultipleBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('Api blogs:', () => {
  test('All blogs are returned in JSON format', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      // Verify correct format
      .expect('Content-Type', /application\/json/)
    // Verify the correct amount of blogs are returned
    assert.strictEqual(response.body.length, listWithMultipleBlogs.length)
  })

  test('Blogs have an id property instead of _id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
      // Verify the id property exists and _id does not
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  test('A valid blog can be added to database', async () => {
    const newBlog = {
      title: 'This is a valid blog',
      author: 'Unknown',
      url: 'validBlogs.com',
      likes: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const finalResponse = await api.get('/api/blogs')
    const finalBlogs = finalResponse.body

    // Verify the total number of blogs has increased by one
    assert.strictEqual(finalBlogs.length, listWithMultipleBlogs.length + 1)
    // Verify that the content of the blog post is saved correctly to the database
    const blogAdded = finalBlogs.find(blog =>
      blog.title === newBlog.title &&
			blog.author === newBlog.author &&
			blog.url === newBlog.url &&
			blog.likes === newBlog.likes
    )
    assert(blogAdded)
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
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Verify that the likes property is set to 0 by default
    assert.strictEqual(response.body.likes, 0)
  })

  test('Blog without title is not added', async () => {
    const newBlog = {
      author: 'Todd  Titleton',
      url: 'noTitle.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const finalResponse = await api.get('/api/blogs')
    const finalBlogs = finalResponse.body

    // Verify the total number of blogs has not increased
    assert.strictEqual(finalBlogs.length, listWithMultipleBlogs.length)
  })

  test('Blog without url is not added', async () => {
    const newBlog = {
      author: 'Mrs Nourl',
      title: 'Blog with no url',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const finalResponse = await api.get('/api/blogs')
    const finalBlogs = finalResponse.body

    // Verify the total number of blogs has not increased
    assert.strictEqual(finalBlogs.length, listWithMultipleBlogs.length)
  })

  describe('Deletion of a blog', () => {
    test('Succeeds with status code 204 if id valid', async () => {
      const blogs = await api.get('/api/blogs')
			const blogToDelete = blogs.body[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

			const blogsAtEnd = await api.get('/api/blogs')

			// Verify the total number of blogs has decreased by one
			assert.strictEqual(listWithMultipleBlogs.length - 1, blogsAtEnd.body.length)
    })
  })
})

test('dummy returns one', () => {
  const blogs = []

  const result = dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(totalLikes([]), 0)
  })
  test('when list has only one blog, equals the likes of that', () => {
    assert.strictEqual(totalLikes(listWithOneBlog), 7)
  })

  test('of a biggert list is calculated right', () => {
    assert.strictEqual(totalLikes(listWithMultipleBlogs), 36)
  })
})

describe('favorite blog', () => {
  test('of empty list is null', () => {
    const result = favoriteBlog([])
    const expected = null
    assert.deepStrictEqual(result, expected)
  })

  test('when list has only one blog returns it as favorite', () => {
    const result = favoriteBlog(listWithOneBlog)
    const expected = {
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7,
    }
    assert.deepStrictEqual(result, expected)
  })

  test('of a biggert list returns one of the blogs with the most likes', () => {
    const result = favoriteBlog(listWithMultipleBlogs)
    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    }
    assert.deepStrictEqual(result, expected)
  })
})

describe('Most blogs', () => {
  test('of empty list is null', () => {
    const result = mostBlogs([])
    const expected = null
    assert.deepStrictEqual(result, expected)
  })

  test('when list has only one blog returns the author of that blog', () => {
    const result = mostBlogs(listWithOneBlog)
    const expected = {
      author: 'Michael Chan',
      blogs: 1,
    }
    assert.deepStrictEqual(result, expected)
  })

  test('of a biggert list returns one of the authors with the most blogs', () => {
    const result = mostBlogs(listWithMultipleBlogs)
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    assert.deepStrictEqual(result, expected)
  })
})

describe('Most Likes', () => {
  test('of empty list is null', () => {
    const result = mostLikes([])
    const expected = null
    assert.deepStrictEqual(result, expected)
  })

  test('when list has only one blog returns the author of that blog', () => {
    const result = mostLikes(listWithOneBlog)
    const expected = {
      author: 'Michael Chan',
      likes: 7,
    }
    assert.deepStrictEqual(result, expected)
  })

  test('of a biggert list returns one of the authors with the most likes', () => {
    const result = mostLikes(listWithMultipleBlogs)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    assert.deepStrictEqual(result, expected)
  })
})

after(async () => {
  await mongoose.connection.close()
})