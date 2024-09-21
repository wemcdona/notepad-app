const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Assuming db.js exports the Sequelize instance

const Note = sequelize.define('Note', {
  // Foreign key for the user
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users', // Name of the users table
      key: 'id',
    },
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Default to the current date and time
  },
});

module.exports = Note;
