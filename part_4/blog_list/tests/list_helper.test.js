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
      // Ensure correct format
      .expect('Content-Type', /application\/json/)
    // Ensure the correct amount of blogs are returned
    assert.strictEqual(response.body.length, listWithMultipleBlogs.length)
  })

  test('Blogs have an id property instead of _id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
      // Ensure the id property exists and _id does not
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
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