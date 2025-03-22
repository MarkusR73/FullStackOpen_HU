const mongoose = require('mongoose')
const Author = require('../models/author')
const Book = require('../models/book')
const authors = require('./authorData')
const books = require('./bookData')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

const importData = async () => {
	try {
		await mongoose.connect(MONGODB_URI)
		console.log('Connected to MongoDB')

		await Author.deleteMany({})
		await Book.deleteMany({})
		console.log('Existing data cleared')

		const savedAuthors = await Author.insertMany(authors)
		console.log('Authors imported')

		const authorMap = {}
		savedAuthors.forEach((author) => {
			authorMap[author.name] = author._id
		})

		const booksWithAuthorIds = books.map((book) => ({
			...book,
			author: authorMap[book.author],
		}))

		await Book.insertMany(booksWithAuthorIds)
		console.log('Books imported')

		mongoose.connection.close()
		console.log('Database connection closed')
	} catch (error) {
		console.error('Error importing data:', error)
		mongoose.connection.close()
	}
}

importData()
