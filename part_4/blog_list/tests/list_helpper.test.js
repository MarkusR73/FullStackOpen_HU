const { test, describe } = require('node:test')
const assert = require('node:assert')
const dummy = require('../utils/list_helper').dummy
const totalLikes = require('../utils/list_helper').totalLikes
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const { listWithOneBlog, listWithMultipleBlogs } = require("./test_data")

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
			title: "React patterns",
			author: "Michael Chan",
			likes: 7,
		}
		assert.deepStrictEqual(result, expected)
  })

  test('of a biggert list returns one with the most likes', () => {
		const result = favoriteBlog(listWithMultipleBlogs)
		const expected = {
			title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
		}
		assert.deepStrictEqual(result, expected)
  })
})