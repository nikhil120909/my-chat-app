const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  socket.on('join-room', room => {
    socket.join(room);
    socket.to(room).emit('chat-message', 'A new user joined the room.');

    socket.on('send-message', message => {
      socket.to(room).emit('chat-message', message);
    });

    socket.on('disconnect', () => {
      socket.to(room).emit('chat-message', 'A user left the room.');
    });
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
