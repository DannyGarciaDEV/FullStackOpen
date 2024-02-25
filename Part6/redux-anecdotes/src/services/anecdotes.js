import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

export const getAll = async () => {
  try {
    const request = await axios.get(baseUrl);
    return request.data;
  } catch (error) {
    console.error('Error fetching anecdotes:', error);
    throw error;
  }
};

export const vote = async (id, anecdote) => {
  try {
    const voteAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    const request = await axios.put(`${baseUrl}/${id}`, voteAnecdote);
    return request.data;
  } catch (error) {
    console.error('Error voting for anecdote:', error);
    throw error;
  }
};

export const createNew = async anecdote => {
  try {
    const getId = () => (100000 * Math.random()).toFixed(0);
    const newAnecdote = { content: anecdote, votes: 0, id: getId() };
    const request = await axios.post(baseUrl, newAnecdote);
    return request.data;
  } catch (error) {
    console.error('Error creating new anecdote:', error);
    throw error;
  }
};
