const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const app = express();
require('dotenv').config()

const port = 3000;

app.use(express.json());
app.use(cors());

console.log(process.env.DB_URL);

mongoose.connect( process.env.DB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Focus-Flow Backend');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
