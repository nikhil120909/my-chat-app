const socket = io();
let currentRoom = '';
let userName = '';

function generateRoomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createRoom() {
  const name = document.getElementById('nameInput').value.trim();
  if (!name) return alert("Please enter your name first.");
  userName = name;
  const code = generateRoomCode();
  joinRoomWithCode(code);
}

function joinRoom() {
  const name = document.getElementById('nameInput').value.trim();
  if (!name) return alert("Please enter your name first.");
  userName = name;
  const code = document.getElementById('roomInput').value.trim();
  if (/^\d{6}$/.test(code)) {
    joinRoomWithCode(code);
  } else {
    alert("Please enter a valid 6-digit code.");
  }
}

function joinRoomWithCode(code) {
  currentRoom = code;
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('chat').classList.remove('hidden');
  document.getElementById('roomCode').textContent = code;
  socket.emit('join-room', code);
}

function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  if (message) {
    appendMessage(`${userName}: ${message}`);
    socket.emit('send-message', {
      user: userName,
      text: message
    });
    input.value = '';
  }
}

function appendMessage(msg) {
  const messages = document.getElementById('messages');
  const div = document.createElement('div');
  div.textContent = msg;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

socket.on('chat-message', (data) => {
  appendMessage(`${data.user}: ${data.text}`);
});
