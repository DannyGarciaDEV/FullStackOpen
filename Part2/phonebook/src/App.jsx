import React, { useState, useEffect } from 'react';
import personServices from './services/persons.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Heading = ({ text }) => {
  return <h2>{text}</h2>;
};

const Filter = ({ text, value, handleNewChange }) => {
  return (
    <div>
      {text} <input value={value} onChange={handleNewChange} />
    </div>
  );
};

const Part = ({ text, value, handleNewChange }) => {
  return (
    <div>
      {text} <input value={value} onChange={handleNewChange} />
    </div>
  );
};

const Button = ({ type, text, handleNewChange }) => {
  return (
    <button type={type} onClick={handleNewChange}>
      {text}
    </button>
  );
};

const PersonForm = ({ onSubmit, newName, newNumber, handleNewName, handleNewNumber }) => {
  return (
    <form onSubmit={onSubmit}>
      <Part text="name:" value={newName} handleNewChange={handleNewName} />
      <Part text="number:" value={newNumber} handleNewChange={handleNewNumber} />
      <Button text="add" type="submit" />
    </form>
  );
};

const Persons = ({ personAfterFilter }) => {
  return <ul>{personAfterFilter}</ul>;
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');
  const [changeMessage, setChangeMessage] = useState('');

  useEffect(() => {
    personServices.getAll().then((initialResult) => {
      setPersons(initialResult);
    });
  }, []);

  const addPerson = async (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    const checkName = persons.find(
      (props) => props.name.toLowerCase() === newPerson.name.toLowerCase()
    );
    const changedPerson = { ...checkName, number: newNumber };

    if (checkName && checkName.number === newPerson.number) {
      toast.error(`${newName} is already added to phonebook`);
    } else if (checkName && checkName.number !== newPerson.number) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        try {
          const returnedPerson = await personServices.updatePerson(
            checkName.id,
            changedPerson
          );
          setPersons(
            persons.map((n) => (n.id !== checkName.id ? n : returnedPerson))
          );
          setNewName('');
          setNewNumber('');
          setTimeout(() => {
            toast.success(`Number of ${newName} is changed`);
          }, 5000);
        } catch (error) {
          toast.error(
            `Information of ${newName} has already been removed from the server`
          );
        }
      }
    } else {
      try {
        const returnedPerson = await personServices.create(newPerson);
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
        toast.success(`Successfully added ${newName}`);
        setTimeout(() => {
          toast.dismiss();
        }, 5000);
      } catch (error) {
        toast.error(`[Error] ${error.response.data.error}`);
      }
    }
  };

  const handleNewName = (event) => {
    setNewName(event.target.value);
  };

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleNewFilter = (event) => {
    setFilterName(event.target.value);
  };

  const filter = persons
    ? persons.filter((props) =>
        props.name.toLowerCase().includes(filterName.toLowerCase())
      )
    : [];

    const deletePerson = async (id, name) => {
      if (window.confirm(`Delete ${name}?`)) {
        try {
          await personServices.removePerson(id);
          setPersons(persons.filter((p) => p.id !== id));
          toast.success(`Successfully deleted ${name}`);
        } catch (error) {
          console.error('Error deleting person:', error);
        }
      }
    };

  const People = ({ name, number, id }) => {
    return (
      <li>
        {name} {number}{' '}
        <Button
          text="delete"
          type="button"
          handleNewChange={() => deletePerson(id, name)}
        />
      </li>
    );
  };

  const personAfterFilter = filter.map((props) => (
    <People key={props.id} name={props.name} number={props.number} id={props.id} />
  ));

  return (
    <div>
      <Heading text="Phonebook" />
      <Notification message={changeMessage} />
      <Filter
        text="Filter shown with"
        value={filterName}
        handleNewChange={handleNewFilter}
      />
      <Heading text="Add a new" />
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNewName={handleNewName}
        handleNewNumber={handleNewNumber}
      />
      <Heading text="Numbers" />
      <Persons personAfterFilter={personAfterFilter} />
      <ToastContainer />
    </div>
  );
};

export default App;