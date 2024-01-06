import React, { useState, useEffect } from 'react';
import personServices from './services/persons.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'; // Import your CSS file

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

const Notification = ({ message, notificationType }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={`notification-container ${notificationType}`}>
      {message}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');
  const [changeMessage, setChangeMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');

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
      setNotificationType('error');
      setChangeMessage(`${newName} is already added to phonebook`);
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
          setNotificationType('success');
          setChangeMessage(`Number of ${newName} is changed`);
        } catch (error) {
          setNotificationType('error');
          setChangeMessage(
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
        setNotificationType('success');
        setChangeMessage(`Successfully added ${newName}`);
      } catch (error) {
        setNotificationType('error');
        setChangeMessage(`[Error] ${error.response.data.error}`);
      }
    }

    // Set a timeout to clear the notification after 5 seconds
    setTimeout(() => {
      setChangeMessage('');
      setNotificationType('');
    }, 5000);
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
          setNotificationType('success');
          setChangeMessage(`Successfully deleted ${name}`);
        } catch (error) {
          console.error('Error deleting person:', error);
          if (error.response && error.response.status === 404) {
            // Person not found, might have already been deleted
            setNotificationType('error');
            setChangeMessage(`Person ${name} not found or already deleted`);
          } else {
            // Other error
            setNotificationType('error');
            setChangeMessage(`Error deleting ${name}: ${error.message}`);
          }
        }
    
        // Set a timeout to clear the notification after 5 seconds
        setTimeout(() => {
          setChangeMessage('');
          setNotificationType('');
        }, 5000);
    
        // Refresh the data after deleting a person
        personServices.getAll().then((result) => {
          setPersons(result);
        });
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
      <Notification message={changeMessage} notificationType={notificationType} />
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