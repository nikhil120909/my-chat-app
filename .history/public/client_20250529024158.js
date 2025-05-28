const socket = io();
let currentRoom = '';

function generateRoomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createRoom() {
  const room = generateRoomCode();
  joinRoomWithCode(room);
}

function joinRoom() {
  const room = document.getElementById('roomInput').value;
  if (room.length === 6 && /^\d+$/.test(room)) {
    joinRoomWithCode(room);
  } else {
    alert("Please enter a valid 6-digit numeric code.");
  }
}

function joinRoomWithCode(room) {
  currentRoom = room;
  document.getElementById('setup').classList.add('hidden');
  document.getElementById('chat').classList.remove('hidden');
  document.getElementById('roomCode').textContent = room;
  socket.emit('join-room', room);
}

function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  if (message) {
    appendMessage("You: " + message);
    socket.emit('send-message', message);
    input.value = '';
  }
}

function appendMessage(message) {
  const messages = document.getElementById('messages');
  const div = document.createElement('div');
  div.textContent = message;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

socket.on('chat-message', message => {
  appendMessage("Stranger: " + message);
});

