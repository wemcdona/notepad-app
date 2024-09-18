const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const pool = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

router.post('/register', async (req, res) => {
  let { email, username, password } = req.body;

  // Trim input values
  email = email.trim();
  username = username.trim();
  password = password.trim();

  // Regex for username and password validation (with size limits)
  const usernamePattern = /^[a-zA-Z0-9]{3,20}$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;

  // Validate inputs
  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Email, username, and password are required.' });
  }
  if (!usernamePattern.test(username)) {
    return res.status(400).json({ message: 'Username must be 3 to 20 characters long and contain only letters and numbers.' });
  }
  if (!passwordPattern.test(password)) {
    return res.status(400).json({ message: 'Password must be 8 to 50 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.' });
  }

  try {
    // Check if the user already exists by email
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Check if the user already exists by username
    user = await User.findOne({ where: { username } });
    if (user) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Generate a salt and hash the password (salt + hash)
    const salt = await bcrypt.genSalt(10); // Generate salt with a cost factor of 10
    const hashedPassword = await bcrypt.hash(password, salt); // Salt and hash the password

    // Create a new user with the salted-hashed password
    const newUser = await User.create({
      email,
      username,
      password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, user: { id: newUser.id, username: newUser.username, email: newUser.email } });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate a new token and return it to the client
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
