import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Home from './components/Home'; // New Home component
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import NoteApp from './components/NoteApp';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common['x-auth-token'] = authToken;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [authToken]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home as the default route */}
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route path="/register" element={<Register setAuthToken={setAuthToken} />} />
        <Route path="/app" element={<PrivateRoute component={NoteApp} />} /> {/* Protected route for the Note App */}
      </Routes>
    </Router>
  );
};

export default App;
