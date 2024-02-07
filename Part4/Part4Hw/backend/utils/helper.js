import Blog from '../models/blog.js'; // Importing the Blog model

export const initBlog = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
];

export const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

export const blogsInDb = async () => { // 
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  const blogsJson = blogs.map(blog => blog.toJSON()); //

  return blogsJson;
};
