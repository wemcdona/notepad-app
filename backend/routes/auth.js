const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const client = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

router.post('/register', async (req, res) => {
  let { email, username, password, hp_field } = req.body;

  // Honeypot check - if the honeypot field is filled, reject the registration
  if (hp_field) {
    return res.status(400).json({ message: 'Bot detected. Registration blocked.' });
  }

  // Proceed with your normal registration logic
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
    const emailResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailResult.rows.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const usernameResult = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    if (usernameResult.rows.length > 0) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertUserQuery = `INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username`;
    const newUser = await client.query(insertUserQuery, [email, username, hashedPassword]);

    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

module.exports = router;
