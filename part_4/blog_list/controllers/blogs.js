// Define the routing logic for handling requests related to blogs.
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

// Route to fetch all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
		.find({})
		.populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs)
  // Using the express-async-errors library ensures that any exceptions
  // are automatically passed to the error-handling middleware.
})

// Route to add a new blog
blogsRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  const body = request.body

	const user = request.user

	const blog = new Blog({
		url: body.url,
  	title: body.title,
  	author: body.author,
  	user: user.id,
  	likes: body.likes
	})

  const savedBlog = await blog.save()

	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

  response.status(201).json(savedBlog)
  // Using the express-async-errors library ensures that any exceptions
  // are automatically passed to the error-handling middleware.
})

blogsRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
	const user = request.user

  const blogToDelete = await Blog.findById(request.params.id)
	if (!blogToDelete) {
		return response.status(404).json({ error: 'Blog not found' })
	}
	if (blogToDelete.user.toString() === user.id.toString()) {
		await Blog.findByIdAndDelete(request.params.id)
		response.status(204).end()
	}
	else {
		response.status(403).json({ error: 'Forbidden: You have no rights to delete this blog' })
	}
})


blogsRouter.put('/:id', async (request, response) => {
	const { likes } = request.body
	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true, runValidators: true })
	response.json(updatedBlog)
})

module.exports = blogsRouter