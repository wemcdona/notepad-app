const { Client } = require('pg'); // Make sure Client is correctly imported
// require('dotenv').config();
const { getDbConfig } = require('./environment'); // Import the database config

const dbConfig = getDbConfig(); // Retrieve config dynamically

// Create a new PostgreSQL client
const client = new Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE
});

// Connect the client to the database
client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Database connection error:', err.stack));

module.exports = client;