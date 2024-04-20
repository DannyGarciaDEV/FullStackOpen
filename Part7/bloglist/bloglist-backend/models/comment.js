const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
  body: {
    type: String,
    minLength: 8
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }
})

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.blog
  }
})

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment