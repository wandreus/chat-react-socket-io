const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen('8080', () => console.log('Server run'));

let allmessages = []

io.on('connection', socket => {

  socket.emit('hystoricMessages', allmessages)

  socket.on('logeed', name => {
    socket.broadcast.emit('newLogin', name);
    socket.emit('myLogin', name);
  })
  
  socket.on('SendMessage', el => {
    allmessages.push(el)
    socket.broadcast.emit('updateMessages', el);
  })
  
  socket.on('disconnect', (el) => {
    socket.broadcast.emit('userExit', el);    
  })

})