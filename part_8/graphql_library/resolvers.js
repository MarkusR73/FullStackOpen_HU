const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { PubSub, withFilter } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let filter = {}

      if (args && args.genre) filter.genres = { $in: args.genre }
      
      if (args && args.author) {
        const foundAuthor = await Author.findOne({ name: args.author })
        if (foundAuthor) {
          filter.author = foundAuthor._id
        }
        else {
          return []
        }
      }

      const books = await Book.find(filter).populate('author')
      return books
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const books = await Book.find({})

      // Create a mapping of authorId -> book count
      const bookCounts = books.reduce((acc, book) => {
        acc[book.author.toString()] = (acc[book.author.toString()] || 0) + 1
        return acc
	    }, {})
      // Attach book count to each author
      return authors.map(author => ({
        name: author.name,
        born: author.born,
        bookCount: bookCounts[author._id.toString()] || 0
      }))
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        }
        catch (error) {
          throw new GraphQLError('Inserted author name should be at least 4 characters long!', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }
      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
      }
      catch (error) {
        throw new GraphQLError('Inserted book title should be at least 5 characters long!', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      console.log("BOOK_ADDED event published:", book)
      return book.populate('author')
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) return null
      try {
        author.born = args.setBornTo
        await author.save()
      }
      catch(error) {
        throw new GraphQLError('Birthyear needs to be an integer!', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }
      return author
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username, 
        favoriteGenre: args.favoriteGenre
      })
      try {
        await user.save()
        return user
      }
      catch(error) {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED'),
      resolve: async (payload) => {
        return Book.findById(payload.bookAdded._id).populate('author')
      }
    }
  }
}

module.exports = resolvers