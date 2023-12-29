import React, { useState, useEffect } from 'react';
import phonebookService from './phonebookService.jsx';

const Filter = ({ searchTerm, setSearchTerm }) => {
  return (
    <div>
      filter shown with <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
    </div>
  );
};

const PersonForm = ({ addPerson, newName, setNewName, newNumber, setNewNumber }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ persons, searchTerm, deletePerson }) => {
  return (
    <div>
      {persons
        .filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((person, index) => (
          <div key={index}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person.id)}>Delete</button>
          </div>
        ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    phonebookService.getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(`${newName} is already added to the phonebook. Do you want to update the number?`);

      if (confirmUpdate) {
        phonebookService.update(existingPerson.id, { ...existingPerson, number: newNumber })
          .then(updatedPerson => {
            setPersons(persons.map(person => (person.id !== updatedPerson.id ? person : updatedPerson)));
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            console.error('Error updating person:', error);
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };

      phonebookService.create(newPerson)
        .then(createdPerson => {
          setPersons([...persons, createdPerson]);
          setNewName('');
          setNewNumber('');
        })
        .catch(error => {
          console.error('Error adding person:', error);
        });
    }
  };

  const deletePerson = (id) => {
    const confirmDeletion = window.confirm('Do you really want to delete this person?');

    if (confirmDeletion) {
      phonebookService.remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          console.error('Error deleting person:', error);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h3>Numbers</h3>

      <Persons persons={persons} searchTerm={searchTerm} deletePerson={deletePerson} />
    </div>
  );
};

export default App;