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

  (() => {
    socket.emit('welcome', {
      id: socket.id,
      rooms: getAllRooms(io.sockets)
    });
  })();

  socket.on('join', function(room) {
    // leave every room that the socket is in
    /*
    if(socket.rooms) {
      var rooms = Object.keys(socket.rooms);
   .filter(id => !socket.id)
        .map(room => {room: room})
        .map(leaveRoom);
        console.log(rooms);
    }*/

    socket.join(room, handleError);

    socket.emit('joined', room);

    //console.log(io.nsps['/'].adapter.rooms[data.room].sockets);
    //console.log(io.sockets);
  });

  socket.on('leave', leaveRoom);

	socket.on('canvas update', function (room, data) {
    var sendData = {
      peer: socket.id,
      pathID: data.pathID,
      path: data
    };
    // should verify if sender is in room...
		socket.broadcast.to(room).emit('peer update', sendData);
	});
});

module.exports = io;
