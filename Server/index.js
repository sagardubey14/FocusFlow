const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors())

const users = [];

app.get('/', (req, res) => {
  console.log(users);
  res.send('Focus-Flow Backend');
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists.' });
  }
  let videoData = [
    {
      "videoId": "video456",
      "watchedIntervals": [],
      "resumePoint": 0,
      "videoLength": 224.327982
    }
  ]
  const newUser = { username, email, password, videoData };
  users.push(newUser);

  return res.status(201).json({ message: 'User registered successfully.' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({ message: 'No user found with this email.' });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid password.' });
  }

  return res.status(200).json({ message: 'Login successful.', user: { username: user.username, email: user.email } });
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
