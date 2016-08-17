(function() {
  //const cursorIcon;
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();

  const socket = io();

  const getMousePos = function(canvas, evt) {
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };

  const setCursorColor = function(color) {
    canvas.style.cursor = 'url(' + ', auto)';
  }

  const me = {
    id: null,
    pos: {
      x: 0,
      y: 0
    }
  };

  let peers = {};
  let rooms = [];

  socket.on('welcome', function(data) {
    me.id = data.id;
    rooms = data.rooms;
  });

  (function(){
    let interval;

    const mouseMovementListener = function(evt) {
      ctx.lineTo(evt.clientX - rect.left, evt.clientY - rect.top);
    };

    const mouseUpListener = function(evt) {
      clearInterval(interval);
      ctx.stroke();
      canvas.removeEventListener('mousemove', mouseMovementListener);
      canvas.removeEventListener('mouseup', mouseUpListener);
    };

    canvas.addEventListener('mousedown', function(evt) {
      let pos = getMousePos(canvas, evt);
      interval = setInterval(function() {
        ctx.stroke();
      }, 30);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      canvas.addEventListener('mousemove', mouseMovementListener);
      canvas.addEventListener('mouseup', mouseUpListener);
    });


  })();

})();
