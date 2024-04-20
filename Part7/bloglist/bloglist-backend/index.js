const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
const socketio = require('./socket')

const server = http.createServer(app)
socketio(server.listen(config.PORT,() => {
  logger.info(`Server is running on port ${config.PORT}`)
}))

