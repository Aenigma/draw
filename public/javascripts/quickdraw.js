const canvas = document.getElementsByClassName('canvas')[0];
const ctx = canvas.getContext('2d');

const CanvasHandler = function(canvas, csh) {
  this.canvas = canvas;
  this.csh = csh;
  this.ctx = canvas.getContext('2d');
};

CanvasHandler.prototype.buttonActions = {
  thick: function() {
    var thick = prompt("Enter a line width (any num):");
    ctx.lineWidth = thick;

    if (ctx.lineWidth <= 1) {
      this.csh.withLabel('EF');
    } else if (ctx.lineWidth <= 3) {
      this.csh.withLabel('F');
    } else if (ctx.lineWidth <= 5) {
      this.csh.withLabel('M');
    } else {
      this.csh.withLabel('B');
    }
    this.csh.setToCanvas(this.canvas);
  },
  clear: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },
  color: function() {
    var color = prompt("Enter a color (css):");
    ctx.strokeStyle = color;
    this.csh.withColor(ctx.strokeStyle);
    this.csh.setToCanvas(this.canvas);
  },
  linejoin: function() {
    var ls = prompt("Style for line join (bevel, round, miter):");
    ctx.lineJoin = ls;
  },
  linecap: function() {
    var ls = prompt("Style for line cap (butt, round, square):");
    ctx.lineCap = ls;
  }
};

CanvasHandler.prototype.translate = function(e) {
  var rect = canvas.getClientRects()[0];

  var x = (e.clientX - rect.left) / (rect.width / canvas.width);
  var y = (e.clientY - rect.top) / (rect.height / canvas.height);

  return {x: x, y: y};
};

CanvasHandler.prototype.init = function() {
  this.bindButtons();
  this.manageMouseEvents();
};

CanvasHandler.prototype.bindButtons = function() {
  // bind all
  let buttons = document.querySelectorAll('[data-click-action]');
  for (var button of buttons) {
    let bindFuncName = button.getAttribute('data-click-action');
    let bindFunc = this.buttonActions[bindFuncName].bind(this);
    button.addEventListener('click', bindFunc, false);
  }
};

CanvasHandler.prototype.mouseMoveHandler = function(e) {
  var point = this.translate(e);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
};

CanvasHandler.prototype.manageMouseEvents = function() {
  let mouseMoveHandler = this.mouseMoveHandler.bind(this);
  let translate = this.translate.bind(this);

  canvas.addEventListener('mousedown', (e) => {
    var point = translate(e);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    canvas.addEventListener('mousemove', mouseMoveHandler);
  });

  canvas.addEventListener('mouseup', (e) => {
    ctx.stroke();
    canvas.removeEventListener('mousemove', mouseMoveHandler);
  });
};

const CursorStyleHandler = function(svg) {
  this.original = svg;
  this.svg = svg.cloneNode(true);
  this.serializer = new XMLSerializer();
};

CursorStyleHandler.prototype.reset = function() {
  this.svg = this.original.cloneNode(true);

  return this;
};

CursorStyleHandler.prototype.withColor = function(color) {
  this.svg.getElementById('color').style.fill = color;

  return this;
};

CursorStyleHandler.prototype.withLabel = function(label) {
  this.svg.getElementById('label').textContent = label;

  return this;
};

CursorStyleHandler.prototype.buildAsURL = function(color) {
  return 'data:image/svg+xml;base64,' + btoa(
    this.serializer.serializeToString(this.svg)
  );
};

CursorStyleHandler.prototype.setToCanvas = function(canvas) {
  let url = this.buildAsURL();
  canvas.style.cursor = 'url(\'' + url + '\'), auto';
};

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

  loadFile(url, function(res) {
    let cursor = new CursorStyleHandler(this.responseXML);

    let ch = new CanvasHandler(canvas, cursor);
    ch.init();

    //let url = cursor.withColor('blue').withLabel('M')
  });
})('/images/cursor.svg');
