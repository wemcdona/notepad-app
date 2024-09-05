const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect('mongodb://localhost:27017/notepad', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api', noteRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
