const express = require('express');
const client = require('../db');  // PostgreSQL client
const auth = require('../middleware/auth');
const router = express.Router();

// Create a new note
router.post('/notes', auth, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const insertNoteQuery = `INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *`;
    const newNoteResult = await client.query(insertNoteQuery, [userId, title, content]);
    res.json(newNoteResult.rows[0]);
  } catch (error) {
    console.error('Error creating note:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all notes for a user
router.get('/notes', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const getNotesQuery = `SELECT * FROM notes WHERE user_id = $1`;
    const notesResult = await client.query(getNotesQuery, [userId]);
    res.json(notesResult.rows);
  } catch (error) {
    console.error('Error fetching notes:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a note
router.put('/notes/:id', auth, async (req, res) => {
  const { title, content } = req.body;
  const noteId = req.params.id;
  const userId = req.user.id;

  try {
    const updateNoteQuery = `
      UPDATE notes SET title = $1, content = $2 
      WHERE id = $3 AND user_id = $4 RETURNING *`;
    const updatedNoteResult = await client.query(updateNoteQuery, [title, content, noteId, userId]);

    if (updatedNoteResult.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(updatedNoteResult.rows[0]);
  } catch (error) {
    console.error('Error updating note:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a note
router.delete('/notes/:id', auth, async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.id;

  try {
    const deleteNoteQuery = `DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *`;
    const deleteNoteResult = await client.query(deleteNoteQuery, [noteId, userId]);

    if (deleteNoteResult.rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
