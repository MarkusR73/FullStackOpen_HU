require('dotenv').config() // Load environment variables

const PORT = process.env.PORT

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const testPassword = process.env.tPass

module.exports = {
  PORT,
  MONGODB_URI,
  testPassword
}