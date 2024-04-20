import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({
      ...newBlog,
      [name]: value
    });
  };

  const addBlog = (event) => {
    event.preventDefault();
    createBlog(newBlog);
    setNewBlog({
      title: '',
      author: '',
      url: ''
    });
  };

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          Title:
          <input
            type="text"
            name="title"
            value={newBlog.title}
            onChange={handleInputChange}
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            name="author"
            value={newBlog.author}
            onChange={handleInputChange}
          />
        </div>
        <div>
          URL:
          <input
            type="text"
            name="url"
            value={newBlog.url}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default BlogForm;
