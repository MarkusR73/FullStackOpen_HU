// Define the routing logic for handling requests related to blogs.

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Route to fetch all blogs
blogsRouter.get('/', (request, response) => {
  Blog
	  .find({})
		.then(blogs => {
      response.json(blogs)
    })
})

// Route to add a new blog
blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
	  .save()
		.then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogsRouter