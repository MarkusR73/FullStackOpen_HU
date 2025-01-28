// Define the routing logic for handling requests related to blogs.
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

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
blogsRouter.post('/', async (request, response) => {
  const body = request.body

	const users = await User.find({})

	const randomUser = users[Math.floor(Math.random() * users.length)]

	const blog = new Blog({
		url: body.url,
  	title: body.title,
  	author: body.author,
  	user: randomUser.id,
  	likes: body.likes
	})

  const savedBlog = await blog.save()

	randomUser.blogs = randomUser.blogs.concat(savedBlog._id)
	await randomUser.save()

  response.status(201).json(savedBlog)
  // Using the express-async-errors library ensures that any exceptions
  // are automatically passed to the error-handling middleware.
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


blogsRouter.put('/:id', async (request, response) => {
	const { likes } = request.body
	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true, runValidators: true })
	response.json(updatedBlog)
})

module.exports = blogsRouter