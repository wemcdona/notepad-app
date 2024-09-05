const express = require('express');
const auth = require('../middleware/auth');
const Note = require('../models/Note');
const router = express.Router();

// Create a new note
router.post('/notes', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({
      user: req.user.id,
      title,
      content,
    });

    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all notes for a user
router.get('/notes', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a note
router.put('/notes/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, content },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a note
router.delete('/notes/:id', auth, async (req, res) => {
  try {
    await Note.findOneAndRemove({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Note removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
