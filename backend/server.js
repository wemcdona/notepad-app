// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Note = require('./models/note');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Create a new note
app.post('/notes', async (req, res) => {
  try {
    const note = await Note.create({
      title: req.body.title,
      content: req.body.content
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.json(notes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a note
app.put('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (note) {
      note.title = req.body.title;
      note.content = req.body.content;
      await note.save();
      res.json(note);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a note
app.delete('/notes/:id', async (req, res) => {
  try {
    const result = await Note.destroy({ where: { id: req.params.id } });
    if (result) {
      res.json({ message: 'Note deleted' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
