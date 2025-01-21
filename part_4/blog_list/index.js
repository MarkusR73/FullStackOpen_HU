// The entry point of the application. 
// Starts the server and listens for incoming connections.

const app = require('./app')
const config = require('./utils/config') 
const logger = require('./utils/logger') 

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})