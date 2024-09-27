const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const client = require('../db');
const { getJwtSecret } = require('../environment');
const router = express.Router();

// Registration route (already implemented)
router.post('/register', async (req, res) => {
  let { email, username, password } = req.body;

  email = email.trim();
  username = username.trim();
  password = password.trim();

  const usernamePattern = /^[a-zA-Z0-9]{3,20}$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;

  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Email, username, and password are required.' });
  }
  if (!usernamePattern.test(username)) {
    return res.status(400).json({ message: 'Username must be 3 to 20 characters long and contain only letters and numbers.' });
  }
  if (!passwordPattern.test(password)) {
    return res.status(400).json({ message: 'Password must be 8 to 50 characters long, contain uppercase, lowercase, number, and special character.' });
  }

  try {
    // Check if email already exists
    const emailResult = await client.query('SELECT id, email FROM users WHERE email = $1', [email]);
    if (emailResult.rows.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Check if username already exists
    const usernameResult = await client.query('SELECT id, username FROM users WHERE username = $1', [username]);
    if (usernameResult.rows.length > 0) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into the database
    const insertUserQuery = `INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username`;
    const newUser = await client.query(insertUserQuery, [email, username, hashedPassword]);

    // Generate JWT token
    const token = jwt.sign({ id: newUser.rows[0].id }, getJwtSecret(), { expiresIn: '1h' });

    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login route (NEW)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const userResult = await client.query('SELECT id, username, password FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate a new token and return it to the client
    const token = jwt.sign({ id: user.id }, getJwtSecret(), {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user.id, username: user.username, email } });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
