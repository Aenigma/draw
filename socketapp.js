var io = require('socket.io')();
io.serveClient(true);


var handleError = function(err) {
  if(err) {
    console.log(err);
  }
};

var getAllRooms = function(sockets) {
  var rooms = new Set();
  for(var i = 0; i < sockets.length; i++) {
    for(var j = 0; io.sockets[i].rooms
      && j < io.sockets[i].rooms.length; j++) {
        rooms.add(io.sockets[i].rooms[j]);
    }
  }

  return Array.from(rooms).sort();
};

io.sockets.on('connection', function (socket) {

  var leaveRoom = function(data) {
    var roomName = data.room;

    socket.leave(roomName);
    // tell everyone in the room that user has parted
    socket.to(roomName).emit('parted', {
      id: socket.id,
      nick: socket.nick
    });
  };

  (function(){
    socket.emit('welcome', {
      id: socket.id,
      rooms: getAllRooms(io.sockets)
    });
  })();

  socket.on('join', function(data) {
    // leave every room that the socket is in
    socket.rooms
      .map(room => {room: room})
      .map(leaveRoom);

    var roomName = data.room;
    socket.join(roomName, handleError);
  });

  socket.on('leave', leaveRoom);

	socket.on('canvas update', function (data) {
    var sendData = {
      id: socket.id,
      x: data.x,
      y: data.y,
      drawing: {

      }
    };
		socket.broadcast.emit('canvas update', sendData);
	});
});

module.exports = io;
