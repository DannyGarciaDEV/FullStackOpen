import { anecdotesAtStart, asObject } from './data';

const initialState = anecdotesAtStart.map(asObject);

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'VOTE':
      const id = action.data.id;
      const anecdoteToVote = state.find(a => a.id === id);
      const votedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      };
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : votedAnecdote
      );
    default:
      return state;
  }
};

export const voteAnecdote = (id) => ({
  type: 'VOTE',
  data: { id }
});

export default reducer;