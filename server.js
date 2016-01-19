// Require Libraries
const http = require('http');
const express = require('express');
const _ = require('lodash');

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

var votes = {};

// User Connection Event Listener
io.on('connection', function(socket) {
  console.log('User has connected.', io.engine.clientsCount + ' currently connected.' );

  // Emit connection count to all users on connection
  io.sockets.emit('usersConnected', io.engine.clientsCount);

  // Emit message to individual client on connection
  socket.emit('statusMessage', 'Connected');

  // Emit message for vote Cast and Vote Count
  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      socket.emit('voteCast', "You has voted");
      socket.emit('voteCount', _.countBy(votes));

      // Console Log for Debugging
      console.log(channel, message)
    }
  });

  // User Disconnect Action
  socket.on('disconnect', function() {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete votes[socket.id];
    socket.emit('voteCount', _.countBy(votes));
    io.sockets.emit('userConnection', io.engine.clientsCount);
  });
});

// Export Server Module
module.exports = server;
