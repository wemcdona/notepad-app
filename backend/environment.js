// backend/environment.js
require('dotenv').config();  // Load .env variables

// Function to get JWT Secret dynamically
function getJwtSecret() {
  return process.env.JWT_SECRET || 'your_jwt_secret_key';
}

// Function to get PostgreSQL connection details dynamically
function getDbConfig() {
  return {
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'password',
    database: process.env.PG_DATABASE || 'notepad_db',
  };
}

module.exports = {
  getJwtSecret,
  getDbConfig,
};
