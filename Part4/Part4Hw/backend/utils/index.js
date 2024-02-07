const app = require('./app')
const http = require('http')
const config = require('./config')
const logger = require('./logger')


// Example usage
logger.info('Application started.');
const PORT = process.env.PORT || 3001
const server = http.createServer(app)

server.listen(config.PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})