

require('dotenv').config();
module.exports = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI
    // Add other configurations as needed
};