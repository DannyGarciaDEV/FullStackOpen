import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addVote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdotesList = () => {
  const anecdotes = useSelector(state => state.anecdotes);
  const query = useSelector(state => state.query);
  const dispatch = useDispatch();

  const voteHandler = anecdote => {
    dispatch(addVote(anecdote));
    dispatch(setNotification(`You voted for ${anecdote.content}`));
  };

  let sortedAnecdotes = [...anecdotes];

  const sortArray = (a, b) => {
    if (a.votes > b.votes) {
      return -1;
    }
    if (a.votes < b.votes) {
      return 1;
    } else {
      return 0;
    }
  };
  sortedAnecdotes.sort(sortArray);

  let filteredArray = sortedAnecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(query)
  );

  return (
    <>
      {filteredArray.map(anecdote => (
        <div key={anecdote.id} style={styles.anecdote}>
          <div style={styles.content}>{anecdote.content}</div>
          <div style={styles.vote}>
            has {anecdote.votes}
            <button onClick={() => voteHandler(anecdote)} style={styles.button}>
              vote
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

const styles = {
  anecdote: {
    marginBottom: '15px',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '5px',
  },
  content: {
    fontSize: '18px',
    marginBottom: '5px',
  },
  vote: {
    fontSize: '16px',
  },
  button: {
    marginLeft: '10px',
    padding: '5px 10px',
    fontSize: '14px',
    borderRadius: '3px',
    cursor: 'pointer',
    background: '#007bff',
    color: '#fff',
    border: 'none',
  },
};

export default AnecdotesList;
