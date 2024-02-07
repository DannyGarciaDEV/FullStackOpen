
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../utils/app')
const User = require('../models/user');
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

let token
const initialBlogs = [
    {
        title: 'First Blog Post',
        author: 'John Doe',
        url: 'https://example.com/first-blog-post',
        likes: 10
    },
    {
        title: 'Second Blog Post',
        author: 'Jane Smith',
        url: 'https://example.com/second-blog-post',
        likes: 5
    },
   
]

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'root', name: 'Master User', password: passwordHash })

    await user.save()

   

    await Blog.deleteMany({})
    blogs = initialBlogs.map(blog => new Blog({ ...blog, user: user.id }))
    await Blog.insertMany(initialBlogs)
})

test('correct amount of blogs is returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('identifying field is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added ', async () => {
    const initialResponse = await api.get('/api/blogs')

    const newBlog = {
        title: "Full Stack",
        author: "StackMaster",
        url: "https://stack.com/",
        likes: 1
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialResponse.body.length + 1)
})

test('if blog is added with no votes zero will be assumed', async () => {
    const newBlog = {
        title: "Half Stack",
        author: "StackDiscipline",
        url: "https://halfstack.com/"
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)

    expect(response.body.likes).toBeDefined()
})

test('if blog is added with no url or title it will not be added', async () => {
    const newBlog = {
        author: null,
        url: "https://stack.com/",
        likes: 1
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)

    expect(response.status).toBe(400)
})

test('a blog may be removed by issuing http delete request', async () => {
    const newBlog = {
        title: "Full Stack",
        author: "StackMaster",
        url: "https://stack.com/",
        likes: 1
    }

    const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)

    const response = await api.get(`/api/blogs/${result.body.id}`)
    const deleteBlog = await api
        .delete(`/api/blogs/${result.body.id}`)
        .set('Authorization', `bearer ${token}`)
    expect(deleteBlog.status).toBe(204)
})

test('a blog may be edited by issuing http put request', async () => {
    const newBlog = {
        title: "Full Stack",
        author: "StackMaster",
        url: "https://stack.com/",
        likes: 1
    }

    const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)

    newBlog.likes += 1

    await api
        .put(`/api/blogs/${result.body.id}`)
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
    const newResult = await api.get(`/api/blogs/${result.body.id}`)
    expect(newResult.body.likes).toBe(newBlog.likes)
})

test('cannot add blogs without a valid token', async () => {
    const newBlog = {
        title: "Full Stack",
        author: "StackMaster",
        url: "https://stack.com/",
        likes: 1
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer badly forged token`)

    expect(response.status).toBe(401)
})

afterAll(() => {
    mongoose.connection.close()
})