// Import the bcrypt library for hashing passwords
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 })

  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  try {
    const user = await User.findById(request.params.id).populate('blogs')
    if (user) {
      response.json(user)
    } else {
      response.status(404).json({ error: 'User not found' })
    }
  } catch (error) {
    response.status(500).json({ error: 'Something went wrong' })
  }
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (!password) {
    response.status(400).json({ error: 'Password is required' })
  }
  else if (password.length < 3) {
    response.status(400).json({ error: 'Password must be at least 3 characters long' })
  }
  else {
    const saltRounds = 10

    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  }
})

module.exports = usersRouter
