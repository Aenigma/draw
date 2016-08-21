function loadFile (sURL, fCallback) {
  var oReq = new XMLHttpRequest();
  oReq.callback = fCallback;
  oReq.arguments = Array.prototype.slice.call(arguments, 2);
  oReq.onload = function() { this.callback.apply(this, this.arguments); }
  oReq.onerror = function() { console.error(this.statusText); }
  oReq.open("get", sURL, true);
  oReq.send(null);
}

(function(url){
  const canvas = document.getElementsByClassName('canvas')[0];
  let connection = new ConnectionHandler();
  connection.registerEvents();

  connection.socket.emit('join', 'potato');

  loadFile(url, function(res) {
    let cursor = new CursorStyleHandler(this.responseXML);
    let ch = new CanvasHandler(canvas, cursor, connection);
    ch.init();
  });
})('/images/cursor.svg');
