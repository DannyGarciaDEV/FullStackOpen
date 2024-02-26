import React from 'react';
import { connect } from 'react-redux';

import { createAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteForm = (props) => {
  const formHandler = async (e) => {
    e.preventDefault();

    const {
      target: { anecdote },
    } = e;

    const content = anecdote.value.trim();

    if (content.length < 5) {
      props.setNotification('Anecdote must be at least 5 characters long');
    } else {
      props.createAnecdote(content);
      props.setNotification(`You created the anecdote: ${content}`);
      anecdote.value = '';
    }
  };

  return (
    <>
      <h2 style={styles.heading}>Create New Anecdote</h2>
      <form onSubmit={formHandler} style={styles.form}>
        <div style={styles.inputWrapper}>
          <input name="anecdote" style={styles.input} />
        </div>
        <button style={styles.button}>Create</button>
      </form>
    </>
  );
};

const styles = {
  heading: {
    marginBottom: '15px',
    fontSize: '24px',
  },
  form: {
    marginBottom: '20px',
  },
  inputWrapper: {
    marginBottom: '10px',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    width: '50%',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer',
    background: '#007bff',
    color: '#fff',
    border: 'none',
  },
};

const mapDispatchToProps = { setNotification, createAnecdote };

const connectedAnecdoteForm = connect(null, mapDispatchToProps)(AnecdoteForm);

export default connectedAnecdoteForm;
