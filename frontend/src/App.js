import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';
import './App.css';

const mdParser = new MarkdownIt();

const App = () => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({ title: '', content: '' });
  const [notification, setNotification] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const editorRef = useRef();

  useEffect(() => {
    axios.get('http://localhost:3001/notes')
      .then(response => setNotes(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleEditorChange = ({ html, text }) => {
    setNote(prevNote => ({ ...prevNote, content: text }));
  };

  const formatText = (syntax) => {
    const editor = editorRef.current.getTextareaDom();
    const { selectionStart, selectionEnd } = editor;

    const selectedText = note.content.slice(selectionStart, selectionEnd);
    const beforeText = note.content.slice(0, selectionStart);
    const afterText = note.content.slice(selectionEnd);

    const newText = `${beforeText}${syntax}${selectedText}${syntax}${afterText}`;
    setNote(prevNote => ({ ...prevNote, content: newText }));
  };

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
        setNotes(prevNotes => prevNotes.map(n => n.id === id ? response.data : n));
        setSelectedNote(response.data);
        setNote({ title: '', content: '' });
      })
      .catch(error => console.error(error));
  };

  const deleteNote = (id) => {
    axios.delete(`http://localhost:3001/notes/${id}`)
      .then(() => setNotes(prevNotes => prevNotes.filter(n => n.id !== id)))
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
        <div className="toolbar">
          <button onClick={() => formatText('**')}><b>Bold</b></button>
          <button onClick={() => formatText('*')}><i>Italic</i></button>
          <button onClick={() => formatText('~~')}><s>Strikethrough</s></button>
          <button onClick={() => formatText('`')}>Code</button>
          <button onClick={() => formatText('>')}>Quote</button>
          <button onClick={() => formatText('- ')}>Bullet List</button>
        </div>
        <MdEditor
          ref={editorRef}
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

export default App;
