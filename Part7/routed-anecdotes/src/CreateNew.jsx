import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useField } from './hooks';

const CreateNew = ({ addNew }) => {
  const content = useField('text');
  const author = useField('text');
  const info = useField('text');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    });
    content.reset();
    author.reset();
    info.reset();
    navigate('/');
  };

  const handleReset = () => {
    content.reset();
    author.reset();
    info.reset();
  };

  return (
    <div>
      <h2>Create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Content:
          <input {...content} />
        </div>
        <div>
          Author:
          <input {...author} />
        </div>
        <div>
          Info:
          <input {...info} />
        </div>
        <button type="submit">Create</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>
    </div>
  );
};

export default CreateNew;
