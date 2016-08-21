const ConnectionHandler = function() {
  /** unique ID, to know when server is talking about this connection */
  this.id = null;
  /** people in the room you are in */
  this.peers = [];
  /** the list of rooms that already exist */
  this.rooms = [];

  this.joinedRoom = null;
  this.socket = io();
};

ConnectionHandler.prototype.registerEvents = function() {
  const self = this;
  this.socket.on('welcome', (data) => {
    self.id = data.id;
    self.rooms = data.rooms;
  });

  this.socket.on('joined', (room) => {
    self.joinedRoom = room;
  });

  this.socket.on('peer update', (data) => {
    console.log(data);
  });
};

ConnectionHandler.prototype.sendPath = function(pathId, path, done) {
  this.socket.emit('canvas update', this.joinedRoom, {
    pathID: pathId,
    path: {
      stroke: {
        lineWidth: path.stroke.lineWidth,
        strokeStyle: path.stroke.strokeStyle,
        lineJoin: path.stroke.lineJoin,
        lineCap: path.stroke.lineCap
      },
      points: path.points
    },
    done: done
  });
}
