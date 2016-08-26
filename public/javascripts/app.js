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
  let canvas = document.getElementsByClassName('canvas')[0];
  let connection = new ConnectionHandler();

  let ch = new CanvasHandler(canvas);
  ch.register();

  var point = 100;
  let int = setInterval(() => {
    let ctx = ch.layers[1].ctx;
    ctx.save();
    ctx.moveTo(0, 0);
    ctx.strokeStyle = 'red';
    ctx.lineTo(point, point);
    ctx.stroke();
    ctx.restore();
    ch.redraw();

    if(point >= Math.min(canvas.height, canvas.width)) {
      clearInterval(int);
    }
    point++;
  }, 250);

  connection.registerEvents();
  connection.socket.emit('join', 'potato');

  loadFile(url, function(res) {
    let cursor = new CursorStyleHandler(this.responseXML);
    let ch = new CanvasHandler(canvas, cursor, connection);
    ch.init();
  });
})('/images/cursor.svg');
