const Blog = ({ blog, handleLike, handleDelete }) => {
  return (
    <div className='blog'>
      <div>
        <strong>{blog.title}</strong> by {blog.author}
      </div>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        Likes: {blog.likes} <button onClick={() => handleLike(blog)}>Like</button>
      </div>
      <div>
        {blog.user && <span>Added by: {blog.user.username}</span>}
        <button onClick={() => handleDelete(blog)}>Delete</button>
      </div>
    </div>
  );
};

export default Blog;
