const request = require('supertest');
const app = require('../app');

describe('API Tests', () => {
  // Dummy data for testing
  const dummyNote = {
    content: 'Test blog',
    important: true,
  };

  let addedBlogId;

  // Test the POST route
  it('should add a new blog', async () => {
    const response = await request(app)
      .post('/add-blog')
      .send(dummyNote)
      .expect(201);

    addedBlogId = response.body._id; // Assuming your Note model has _id

    expect(response.body.content).toBe(dummyBlog.content);
    expect(response.body.important).toBe(dummyBlog.important);
  });

  // Test the GET route
  it('should get all blogs', async () => {
    const response = await request(app)
      .get('/get-blogs')
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test the PUT route
  it('should update an existing blogs', async () => {
    const updatedNote = {
      content: 'Updated Blog',
      important: false,
    };

    const response = await request(app)
      .put(`/update-blog/${addedBlogId}`)
      .send(updatedNote)
      .expect(200);

    expect(response.body.content).toBe(updatedNote.content);
    expect(response.body.important).toBe(updatedNote.important);
  });

  // Test the DELETE route
  it('should delete an existing blog', async () => {
    const response = await request(app)
      .delete(`/delete-blog/${addedBlogId}`)
      .expect(200);

    expect(response.body._id).toBe(addedBlogId);
  });
});