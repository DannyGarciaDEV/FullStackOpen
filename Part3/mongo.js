const mongoose = require('mongoose');
require('dotenv').config();

const password = process.env.MONGODB_PASSWORD;
const url = `mongodb+srv://dannygarciadev:${password}@cluster0.nbqmops.mongodb.net/persons?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

module.exports = mongoose;