const config = require('./config');
const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('../controllers/blogs');
const usersRouter = require('../controllers/users');
const loginRouter = require('../controllers/login'); // Import loginRouter

const middleware = require('./middleware');
const mongoose = require('mongoose');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
app.use(middleware);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter); // Use loginRouter

module.exports = app;