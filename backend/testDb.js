const client = require('./db'); // Import the client from db.js

async function testDbConnection() {
  try {
    // Test a simple query to ensure the connection is working
    const res = await client.query('SELECT NOW()');
    console.log('PostgreSQL connection successful:', res.rows[0]);
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
  } finally {
    await client.end();  // Close the connection
  }
}

testDbConnection();
