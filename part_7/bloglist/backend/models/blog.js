// Define the Blog model and its schema for MongoDB.
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  author: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: { type: Number, default: 0 },
  comments: [String]  // Array of strings for anonymous comments
})

// Transform _id to id
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    // Ensure consistent property ordering
    return {
      url: returnedObject.url,
      title: returnedObject.title,
      author: returnedObject.author,
      user: returnedObject.user,
      likes: returnedObject.likes,
      id: returnedObject.id
    }
  }
})

module.exports = mongoose.model('Blog', blogSchema)