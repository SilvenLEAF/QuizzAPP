const express = require('express');
const path = require('path');
const io = require('socket.io')(3000);



// ----------------------FIRING EXPRESS APP
const app = express();
app.use(express.static(path.join(__dirname, 'client')));



const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})




// ---------------------------CATCH-ALL HANDLER
app.get('*', (req, res, next)=>{
  try {
    res.sendFile(path.join(__dirname, 'client/index.html'));
  } catch (err) {
    next(err, req, res);
  }
})







// ---------------------------ERROR HANDLER
app.use((err, req, res, next)=>{
  console.log(err.message);
  console.log(err);

  res.json({ msg: `Server error`, error: err.message });
})







// ---------------------------LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
  console.log(`Server is running on port ${ PORT }`);
})