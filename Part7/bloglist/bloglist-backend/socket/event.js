const EventEmitter = require('events')

class Events extends EventEmitter {
  blogCreated(blog) {this.emit('newblog', blog)}
  blogUpdated(blog) {this.emit('blogupdate', blog)}
  blogDeleted(blog) {this.emit('blogdeleted', blog)}
  blogComment(blog) { this.emit('blogcomment', blog)}
}

module.exports = new Events()