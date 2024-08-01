// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({ title: '', content: '' });
  const [notification, setNotification] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/notes')
      .then(response => setNotes(response.data))
      .catch(error => console.error(error));
  }, []);

  const addNote = () => {
    axios.post('http://localhost:3001/notes', note)
      .then(response => {
        const newNote = response.data;
        setNotes(prevNotes => [...prevNotes, newNote]);
        setNotification(`Note "${newNote.title}" added to your memories`);
        setTimeout(() => setNotification(''), 3000);
        setNote({ title: '', content: '' });
      })
      .catch(error => console.error(error));
  };

  const updateNote = (id) => {
    axios.put(`http://localhost:3001/notes/${id}`, note)
      .then(response => {
        setNotes(prevNotes => prevNotes.map(n => n._id === id ? response.data : n));
        setSelectedNote(response.data);
        setNote({ title: '', content: '' });
      })
      .catch(error => console.error(error));
  };

  const deleteNote = (id) => {
    axios.delete(`http://localhost:3001/notes/${id}`)
      .then(() => setNotes(prevNotes => prevNotes.filter(n => n._id !== id)))
      .catch(error => console.error(error));
  };

  const editNote = (note) => {
    setSelectedNote(note);
    setNote(note);
  };

  const selectNote = (note) => {
    setSelectedNote(note);
    setNote(note);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <h2>Notes</h2>
        <ul>
          {notes.map(note => (
            <li key={note.id} onClick={() => selectNote(note)}>
              {note.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="main">
        <h1>Notepad App</h1>
        {notification && <div className="notification">{notification}</div>}
        <input
          type="text"
          value={note.title}
          onChange={e => setNote({ ...note, title: e.target.value })}
          placeholder="Title"
        />
        <textarea
          value={note.content}
          onChange={e => setNote({ ...note, content: e.target.value })}
          placeholder="Content"
        />
        <button onClick={selectedNote ? () => updateNote(selectedNote.id) : addNote}>
          {selectedNote ? 'Update Note' : 'Add Note'}
        </button>
        {selectedNote && (
          <div>
            <button onClick={() => deleteNote(selectedNote.id)}>Delete Note</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
