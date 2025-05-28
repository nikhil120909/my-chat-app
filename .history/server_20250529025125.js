const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('New user connected');

  // Store the room the user joins
  socket.on('join-room', (room) => {
    socket.join(room);
    socket.data.room = room; // store the room on the socket
    console.log(`User joined room: ${room}`);
  });

  // Listen for messages and send them to the correct room
  socket.on('send-message', (data) => {
    const room = socket.data.room;
    if (room) {
      io.to(room).emit('chat-message', {
        user: data.user,
        text: data.text
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
