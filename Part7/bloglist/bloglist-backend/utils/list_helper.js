const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map(blog => blog.likes)
    .reduce((sum, item) => {
      return sum + item
    }, 0)
}

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map(blog => blog.likes))
  return blogs.filter(blog => blog.likes === maxLikes)[0]
}

const mostBlogs = (blogs) => {
  const most = blogs.reduce((allBlogs, current) => {
    const blogsCount = allBlogs[current.author] && allBlogs[current.author].blogs
    allBlogs[current.author] = { author: current.author, blogs: (blogsCount || 0) + 1 }
    return allBlogs
  }, {})

  return Object.values(most)
    .filter(
      author =>
        author.blogs === Math.max(...Object.values(most).map(b => b.blogs))
    )
}

const mostLikes = (blogs) => {
  const most = blogs.reduce((allBlogs, current) => {
    const likesCount = allBlogs[current.author] && allBlogs[current.author].likes

    allBlogs[current.author] = { author: current.author, likes: (likesCount || 0) + current.likes }
    return allBlogs
  }, {})

  return Object.values(most)
    .filter(author => author.likes === Math.max(...Object.values(most).map(b => b.likes)))
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}