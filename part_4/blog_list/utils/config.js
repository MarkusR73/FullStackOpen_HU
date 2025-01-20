require('dotenv').config() // Load environment variables 

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  PORT,
  MONGODB_URI,
}