const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);

  await User.deleteMany({});
  const passwordHash = bcrypt.hashSync('wednesday', 10);
  const user = new User({
    username: 'dantheman',
    passwordHash,
  });
  await user.save();
}, 40000);

afterAll(async () => {
  await mongoose.connection.close();
}, 50000);

// GET /blogs
describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('get all blogs', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('the blog titles list contains "REACT patterns"', async () => {
    const response = await api.get('/api/blogs');
    const titles = response.body.map((r) => r.title);
    expect(titles).toContain('React patterns');
  });

  test('unique identifier property is named id and exists', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body[0].id).toBeDefined();
  });
});


// PUT /api/blogs/:id
describe('HTTP PUT request to /api/blogs/:id', () => {
  test('updates the likes', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updatedBlog = {
      ...blogToUpdate,
      likes: 20,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0].likes).toBe(20);
  });
});
