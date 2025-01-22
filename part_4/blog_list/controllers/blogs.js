// Define the routing logic for handling requests related to blogs.

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Route to fetch all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
  // Using the express-async-errors library ensures that any exceptions
  // are automatically passed to the error-handling middleware.
})

// Route to add a new blog
blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  if (!blog.title || !blog.url) {
    response.status(400).end
  }

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
  // Using the express-async-errors library ensures that any exceptions
  // are automatically passed to the error-handling middleware.
})

module.exports = blogsRouter