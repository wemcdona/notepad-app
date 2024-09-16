import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';  // Removed BrowserRouter
import axios from 'axios';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import NoteApp from './components/NoteApp';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate(); // For redirecting after log out

  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common['x-auth-token'] = authToken;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [authToken]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from local storage
    setAuthToken(null); // Clear auth state
    navigate('/'); // Redirect to home page
  };

  return (
    <div>
      <nav style={{ textAlign: 'right', padding: '10px' }}>
        {authToken ? (
          <Link to="/" onClick={handleLogout}>
            Log Out
          </Link>
        ) : null}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route path="/register" element={<Register setAuthToken={setAuthToken} />} />
        <Route path="/app" element={<PrivateRoute><NoteApp /></PrivateRoute>} />
      </Routes>
    </div>
  );
};

export default App;
