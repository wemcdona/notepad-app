// backend/models/note.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://localhost:5432/notepad', {
  dialect: 'postgres',
  logging: false // Disable logging
});

const Note = sequelize.define('Note', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

sequelize.sync();

module.exports = Note;
