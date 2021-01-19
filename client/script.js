// Location of the SocketIO server
const socket = io('http://localhost:5000'); 


const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')





// Get NAME and emit NEW USER event
const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)






/* -----------------------------------
.       Handle SOCKET IO events
----------------------------------- */

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})





socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})




socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})








/* -----------------------------------
.        MSG Form Socket IO event
----------------------------------- */
messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})











/* -----------------------------------
.   (Helper Function) DOM renderer
----------------------------------- */
function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}