import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';
import '../App.css';

const mdParser = new MarkdownIt();

const NoteApp = () => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({ title: '', content: '' });
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  // Ensure token is set in axios headers
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, []);

  // Fetch notes on component mount
  useEffect(() => {
    axios.get('http://localhost:3001/api/notes')
      .then(response => setNotes(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleEditorChange = ({ html, text }) => {
    setNote(prevNote => ({ ...prevNote, content: text }));
  };

  const addNote = () => {
    if (!note.title.trim() || !note.content.trim()) {
      setError('Title and content cannot be empty.');
      return;
    }

    axios.post('http://localhost:3001/api/notes', note)
      .then(response => {
        const newNote = response.data;
        setNotes(prevNotes => [...prevNotes, newNote]);
        setNotification(`Note "${newNote.title}" added to your memories`);
        setTimeout(() => setNotification(''), 3000);
        setSelectedNote(newNote); // Keep the title and content after adding the note
        setError('');
      })
      .catch(error => {
        console.error('Error adding note:', error);
        setError('Failed to add note');
      });
  };

  const updateNote = (id) => {
    if (!note.title.trim()) {
      setError('Title cannot be empty.');
      return;
    }

    axios.put(`http://localhost:3001/api/notes/${id}`, note)
      .then(response => {
        setNotes(prevNotes => prevNotes.map(n => n.id === id ? response.data : n));
        setSelectedNote(response.data); // Keep the title and content after updating the note
        setNotification('Note updated successfully');
        setTimeout(() => setNotification(''), 3000);
        setError('');
      })
      .catch(error => {
        console.error('Error updating note:', error);
        setError('Failed to update note');
      });
  };

  const deleteNote = (id) => {
    axios.delete(`http://localhost:3001/api/notes/${id}`)
      .then(() => {
        setNotes(prevNotes => prevNotes.filter(n => n.id !== id));
        setSelectedNote(null);
        setNote({ title: '', content: '' }); // Clear the title and content after deleting the note
        setNotification('Note deleted successfully');
        setTimeout(() => setNotification(''), 3000);
      })
      .catch(error => {
        console.error('Error deleting note:', error);
        setError('Failed to delete note');
      });
  };

  const editNote = (note) => {
    setSelectedNote(note);
    setNote(note);
  };

  const selectNote = (note) => {
    setSelectedNote(note);
    setNote(note);
  };

  const createNewNote = () => {
    setSelectedNote(null);
    setNote({ title: '', content: '' });
  };

  return (
    <div className="app">
      <div className="sidebar">
        <h2>Notes</h2>
        <button className="new-note-button" onClick={createNewNote}>
          New Note
        </button>
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
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          value={note.title}
          onChange={e => setNote({ ...note, title: e.target.value })}
          placeholder="Title"
        />
        <MdEditor
          value={note.content}
          style={{ height: '400px' }}
          renderHTML={text => mdParser.render(text)}
          onChange={handleEditorChange}
        />
        <button onClick={selectedNote ? () => updateNote(selectedNote.id) : addNote}>
          {selectedNote ? 'Update Note' : 'Add Note'}
        </button>
        {selectedNote && (
          <div>
            <button onClick={() => deleteNote(selectedNote.id)}>Delete Note</button>
          </div>
        )}
        <div className="preview">
          <h2>Preview</h2>
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default NoteApp;
