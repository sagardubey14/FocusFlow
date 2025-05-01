const User = require('../models/User');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const newUser = new User({
      username,
      email,
      password,
      videoData: [
        {
          videoId: "video456",
          watchedIntervals: [],
          resumePoint: 0,
          videoLength: 224.327982
        }
      ]
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user found with this email.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    return res.status(200).json({ message: 'Login successful.', user: { username: user.username, videodata:user.videoData } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };
