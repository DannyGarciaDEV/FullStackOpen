let io = require('socket.io')
const events = require('./events')

const socketio = (socket) => {
  io = io.listen(socket)
  const blog = io.of('/blog')
  blog.on('connection', (socket) => {

    events.on('newblog', (data) => {

      socket.emit('created', { data })
    })

    events.on('blogupdate', (data) => {

      socket.emit('updated', { data })
    })

    events.on('blogdeleted', (data) => {

      socket.emit('deleted', { data })
    })

    events.on('blogcomment', (data) => {

      socket.emit('commented', { data })
    })

  })

  return io
}

module.exports = socketio