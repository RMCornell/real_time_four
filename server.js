// Require Libraries
const http = require('http');
const express = require('express');

// Instantiate Express
const app = express();

// Serve Public Directory
app.use(express.static('public'));

// Serve index.html when '/' is visited
app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/index.html');
});

// Create Server Running Process
const port = process.env.PORT || 3000;

const server = http.createServer(app)
  .listen(port, function () {
    console.log('Listening on port ' + port + '.');
  });

// Set up Socket.io
const socketIo = require('socket.io');
const io = socketIo(server);

// User Connection Event Listener
io.on('connection', function(socket) {
  console.log('User has connected.', io.engine.clientsCount + ' currently connected.' );

  // Emit connection count to all users on connection
  io.sockets.emit('usersConnected', io.engine.clientsCount);

  // Emit message to individual client on connection
  socket.emit('statusMessage', 'Connected');

  socket.on('disconnect', function() {
    console.log('User has disconnected', io.engine.clientsCount + ' currently connected.');
    // Emmit connection count to all users on disconnection
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });

  // Poll listener
  socket.on('message', function(channel, message) {
    console.log(channel, message)
  })

});

// User Disconnection Event Listener



// Export Server Module
module.exports = server;
