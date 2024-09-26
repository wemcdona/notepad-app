import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = ({ setAuthToken }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Honeypot field
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (honeypot) {
      // If honeypot field is filled, return an error to prevent registration
      setError('Bot detected. Registration blocked.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        email: email.trim(),
        username: username.trim(),
        password: password.trim(),
      });
      localStorage.setItem('token', response.data.token);
      setAuthToken(response.data.token);
      navigate('/app');
    } catch (err) {
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
        
        {/* Honeypot Field */}
        <div style={{ display: 'none' }}>
          <input
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            name="hp_field"
            placeholder="Leave this field empty"
          />
        </div>

        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Log In</Link></p>
    </div>
  );
};

export default Register;
