const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const phonebookSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true, unique: true },
  number: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        /* The phone number must contain at least 8 digits */
        return value.replace(/[^0-9]/g, '').length >= 8;
      },
      message: 'Phone number must contain at least 8 digits',
    },
  },
});

phonebookSchema.plugin(uniqueValidator);

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', phonebookSchema);
