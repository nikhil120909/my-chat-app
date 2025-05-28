const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);

    socket.on('send-message', (data) => {
      io.to(room).emit('chat-message', {
        user: data.user,
        text: data.text
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from room: ${room}`);
    });
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
