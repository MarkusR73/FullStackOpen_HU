const config = require('./utils/config') // import environmental variables
const logger = require('./utils/logger') // import loggers
const middleware = require('./utils/middleware') // import middleware
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')


// Blog schema and model
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
	  logger.info('Connected to MongoDB')
  })
  .catch((error) => {
	  logger.error('Error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger) // Log details of incoming requests.


// Routes
app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})