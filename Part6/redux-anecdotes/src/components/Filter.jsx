import React from 'react';
import { connect } from 'react-redux';
import { filterState } from '../reducers/filterReducer';

const Filter = (props) => {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    props.filterState(value.toLowerCase());
  };

  const style = {
    marginBottom: 10,
    fontSize: '16px',
  };

  const inputStyle = {
    padding: '8px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  return (
    <div style={style}>
      <label htmlFor="filterInput">Filter</label>{' '}
      <input
        id="filterInput"
        style={inputStyle}
        onChange={handleChange}
        placeholder="Type to filter"
      />
    </div>
  );
};

const mapDispatchToProps = { filterState };

const connectedFilter = connect(null, mapDispatchToProps)(Filter);

export default connectedFilter;
