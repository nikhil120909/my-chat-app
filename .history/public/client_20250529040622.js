const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get('name');
const currentRoom = urlParams.get('room');

if (!userName || !currentRoom) {
  alert("Invalid login. Redirecting...");
  window.location.href = "login.html";
}

document.getElementById('roomCode').textContent = currentRoom;
socket.emit('join-room', currentRoom);

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
