const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: {
    type: String,
    required: true
  }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash

    // Ensure consistent property ordering
    return {
      blogs: returnedObject.blogs,
      username: returnedObject.username,
      name: returnedObject.name,
      id: returnedObject.id
    }
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User