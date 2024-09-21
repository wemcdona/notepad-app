const { Client } = require('pg');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a PostgreSQL client (pg.Client)
const client = new Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE
});

// Connect the client to the database
client.connect()
  .then(() => console.log('Connected to PostgreSQL database with pg.Client'))
  .catch(err => console.error('pg.Client Database connection error:', err.stack));

// Create a new Sequelize instance
const sequelize = new Sequelize(
  process.env.PG_DATABASE,  // Database name
  process.env.PG_USER,      // Username
  process.env.PG_PASSWORD,  // Password
  {
    host: process.env.PG_HOST, // Host
    port: process.env.PG_PORT, // Port
    dialect: 'postgres',       // Dialect (PostgreSQL)
    logging: false             // Disable logging of SQL queries (optional)
  }
);

// Test the Sequelize database connection
sequelize.authenticate()
  .then(() => console.log('Connected to PostgreSQL database with Sequelize'))
  .catch(err => console.error('Sequelize connection error:', err));

module.exports = { client, sequelize };  // Export both the pg.Client and Sequelize instance
