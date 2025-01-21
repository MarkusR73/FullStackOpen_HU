// Initializes the Express application, connects to MongoDB, and configures middleware and routes.

const config = require('./utils/config') 
const logger = require('./utils/logger') 
const middleware = require('./utils/middleware') 
const blogsRouter = require('./controllers/blogs') 
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
	  logger.info('Connected to MongoDB')
  })
  .catch((error) => {
	  logger.error('Error connecting to MongoDB:', error.message)
  })

// Middleware configuration.
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

// Routes configuration.
app.use('/api/blogs', blogsRouter)

module.exports = app