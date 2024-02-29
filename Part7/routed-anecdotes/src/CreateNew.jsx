import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNew = ({ addNew }) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [info, setInfo] = useState('');
  const [notification, setNotification] = useState('');
  const navigate = useNavigate(); // Use useNavigate hook to navigate

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content,
      author,
      info,
      votes: 0
    });
    setContent('');
    setAuthor('');
    setInfo('');
    navigate('/'); // Use navigate function to redirect to home
    setNotification('Anecdote created successfully!');
    setTimeout(() => {
      setNotification('');
    }, 5000);
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          author
          <input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          url for more info
          <input name='info' value={info} onChange={(e)=> setInfo(e.target.value)} />
        </div>
        <button>create</button>
      </form>
      {notification && <p>{notification}</p>}
    </div>
  );
};

export default CreateNew;
