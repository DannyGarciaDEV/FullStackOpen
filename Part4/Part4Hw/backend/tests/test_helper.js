const Blog = require('../index.js');

export const initBlogs = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

export const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

export const blogInDb = async () => {
  const blog = await Blog.find({}).populate('user', { username: 1, name: 1 })
  const blogsJson = blog.map(note => note.toJSON())

  return blogsJson
}