/* Environment Variables */
const mongoose = require('./mongo.js'); // Assuming mongo.js is in the same directory
require('dotenv').config();

/* Third-Party Dependencies */
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

/* Internal Dependencies */
const Person = require('./models/person')

/* Middleware */
app.use(express.static('build'))
app.use(cors())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    req.method === 'POST' ? JSON.stringify(req.body) : ''
  ].join(' ')
}))
app.use(express.json())


/* List all people */
app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(phonebook => {
    res.json(phonebook.map(person => person.toJSON()))
  }).catch(error => next(error))
})

/* List a specific person by ID */
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(result => {
    if (result) {
      res.json(result)
    }
    else {
      res.status(404).end()
    }
  }).catch(error => next(error))
})

/* Update an existing person */
app.put('/api/persons/:id', (req, res, next) => {
  const updatedPerson = {
    name: req.body.name,
    number: req.body.number
  }
  Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true }).then(result => {
    res.json(result)
  }).catch(error => next(error))
})

/* Delete a person */

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then(result => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Person not found' });
      }
    }).catch(error => next(error));
  });

/* Add a new person */
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required' });
  }

  // Check if the name already exists
  Person.findOne({ name }).then(existingPerson => {
    if (existingPerson) {
      return res.status(400).json({ error: 'Name must be unique' });
    }

    const newPerson = new Person({
      name,
      number
    });

    newPerson.save().then(response => {
      res.json(response);
    }).catch(error => next(error));
  }).catch(error => next(error));
});
/* Status page */

app.get('/info', (req, res, next) => {
    Person.countDocuments({}).then(count => {
      const info = `
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `;
      res.send(info);
    }).catch(error => next(error));
  });


/* List a specific person by ID */
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(result => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'Person not found' });
      }
    }).catch(error => next(error));
  });


  /* Display information for a single phonebook entry */
  app.get('/api/persons/:id/info', (req, res, next) => {
    Person.findById(req.params.id).then(result => {
      if (result) {
        res.json({
          name: result.name,
          number: result.number,
          id: result._id
        })
      } else {
        res.status(404).json({ error: 'Person not found' })
      }
    }).catch(error => next(error))
  })


/* Error Handler */
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.message.includes('ObjectId')) {
    return res.status(400).json({ error: 'Malformed ID' })
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)


/* Runs the server */
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})