// Initiate Websocket Connection from client
var socket = io();

// Event Listener for Client Count
// Get Element Information will be sent to
var connectionCount = document.getElementById('connection-count');

// Create Listener
socket.on('usersConnected', function(count) {
  connectionCount.innerText = 'Users Connected: ' + count;
});

// Event Listener for Status Message
// Get element information will be sent to
var statusMessage = document.getElementById('status-message');

// Create Listener
socket.on('statusMessage', function(message) {
  statusMessage.innerText = message + 'from' + socket.id;
});

// Event Listener for Options
// Get button elements
var buttons = document.querySelectorAll('#options button');

// Create listener to get option selected
for(var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    // Send Option information back to server
    socket.send('voteCast', this.innerText);
  });
}

// Vote Casting
socket.on('voteCast', function(message){
  statusMessage.innerText = message;
});

// Event Listener for Vote Results
// Get Element Vote Results will be passed to
var voteTotals = document.getElementById('vote-count');

socket.on('voteCount', function(votes) {
  var votesToShow = "Vote Totals";
  for (var vote in votes) {
    votesToShow = votesToShow + '<p>' + vote + ': ' + votes[vote] + '</p>';
  };

  voteTotals.innerHTML = votesToShow;


});



