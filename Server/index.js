const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const { getOnlineUsers, updateVideoData, updateResumeTime, handleDisconnect } = require('./services/SocketServices');
const app = express();
const server = http.createServer(app);
const io = socketIo(server ,{
  cors: {
    origin: process.env.API_URL,
    methods: ["GET", "POST"]
  }
});

require('dotenv').config()

const port = 3000;

app.use(express.json());
app.use(cors());

mongoose.connect( process.env.DB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Focus-Flow Backend');
});

io.on('connection', (socket) => {

  console.log('a user connected', socket.handshake.query.email);

  socket.on('updates',(upt)=>{
    updateVideoData(socket.handshake.query.email, upt);
  })
  socket.on('resume-point',(time)=>{
    updateResumeTime(socket.handshake.query.email, time);
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
    handleDisconnect(socket.handshake.query.email);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
