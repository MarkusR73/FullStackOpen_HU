// Define the Blog model and its schema for MongoDB.
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
	title: String,
	author: String,
	url: String,
	likes: Number
})

module.exports = mongoose.model('Blog', blogSchema)