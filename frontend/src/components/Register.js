import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = ({ setAuthToken }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim input values to remove spaces before and after
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Username and password validation patterns
    const usernamePattern = /^[a-zA-Z0-9]+$/;  // Only letters and numbers
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;  // Password must contain lowercase, uppercase, number, special character

    // Validate the fields
    if (!trimmedEmail || !trimmedUsername || !trimmedPassword) {
      setError('All fields are required.');
      return;
    }
    if (!usernamePattern.test(trimmedUsername)) {
      setError('Username can only contain letters and numbers.');
      return;
    }
    if (!passwordPattern.test(trimmedPassword)) {
      setError('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        email: trimmedEmail,
        username: trimmedUsername,
        password: trimmedPassword,
      });
      localStorage.setItem('token', response.data.token);
      setAuthToken(response.data.token);
      navigate('/app');
    } catch (err) {
      console.error('Registration error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Log In</Link></p>
    </div>
  );
};

export default Register;
