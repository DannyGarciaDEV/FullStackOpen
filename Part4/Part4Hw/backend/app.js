const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const { info, error } = require('./utils/logger');

const blogRouter = require('./controller/blogs');
const userRouter = require('./controller/users');
const loginRouter = require('./controller/login');

const User = require('./models/user');

// Middleware to extract token from request headers
const tokenExtractor = (request, response, next) => {
  if (!request.headers['authorization']) return next();

  const authorization = request.get('Authorization');
  const token = authorization.substring(7); // Removing 'Bearer ' from the token
  request.token = token;

  next();
};

// Middleware to extract user information from token
const userExtractor = async (request, response, next) => {
  const token = request.token;
  if (!token) return next();

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Invalid token' });
    }

    const tokenUserId = decodedToken.id;
    const user = await User.findById(tokenUserId);

    request.user = user;
    next();
  } catch (error) {
    return response.status(401).json({ error: 'Token verification failed' });
  }
};

// Middleware to handle authentication for API routes
const requireAuth = (request, response, next) => {
  if (!request.user) {
    return response.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Middleware to handle CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Connect to MongoDB database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    info('Connected to database');
  })
  .catch((err) => {
    error('Error connecting to database:', err.message);
  });

// Apply token extractor middleware
app.use(tokenExtractor);

// Routes for authentication
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);

// Routes for blogs with user extraction and authentication
app.use('/api/blogs', userExtractor, requireAuth, blogRouter);

// Routes for testing (only in test environment)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controller/testing');
  app.use('/api/testing', testingRouter);
}

module.exports = app;