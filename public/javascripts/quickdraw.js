const CanvasHandler = function(canvas, csh, connection) {
  this.canvas = canvas;
  this.csh = csh;
  this.ctx = canvas.getContext('2d');
  this.connection = connection;

  this.paths = [];

  /* these properties are stateful */
  this._points = [];
  this._pathCount = 0;
  this._lastContextState = null;
};

CanvasHandler.prototype.buttonActions = {
  thick: function() {
    var thick = prompt("Enter a line width (any num):");
    this.ctx.lineWidth = thick;

    if (this.ctx.lineWidth <= 1) {
      this.csh.withLabel('EF');
    } else if (this.ctx.lineWidth <= 3) {
      this.csh.withLabel('F');
    } else if (this.ctx.lineWidth <= 5) {
      this.csh.withLabel('M');
    } else {
      this.csh.withLabel('B');
    }
    this.csh.setToCanvas(this.canvas);
  },
  clear: function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  color: function() {
    var color = prompt("Enter a color (css):");
    this.ctx.strokeStyle = color;
    this.csh.withColor(this.ctx.strokeStyle);
    this.csh.setToCanvas(this.canvas);
  },
  linejoin: function() {
    var ls = prompt("Style for line join (bevel, round, miter):");
    this.ctx.lineJoin = ls;
  },
  linecap: function() {
    var ls = prompt("Style for line cap (butt, round, square):");
    this.ctx.lineCap = ls;
  }
};

CanvasHandler.prototype.translate = function(e) {
  var rect = this.canvas.getClientRects()[0];

  var x = (e.clientX - rect.left) / (rect.width / this.canvas.width);
  var y = (e.clientY - rect.top) / (rect.height / this.canvas.height);

  return {x: x, y: y};
};

CanvasHandler.prototype.init = function() {
  this._bindButtons();
  this._manageMouseEvents();
};

CanvasHandler.prototype._bindButtons = function() {
  // bind all
  let buttons = document.querySelectorAll('[data-click-action]');
  for (var button of buttons) {
    let bindFuncName = button.getAttribute('data-click-action');
    let bindFunc = this.buttonActions[bindFuncName].bind(this);
    button.addEventListener('click', bindFunc, false);
  }
};

CanvasHandler.prototype._mouseMoveHandler = function(e) {
  var point = this.translate(e);

  this._points.push(point);
  this._update(false);

  this.ctx.lineTo(point.x, point.y);
  this.ctx.stroke();
};

CanvasHandler.prototype._update = function(done) {
  let pathId = this.connection.id + this._pathCount;


  this.connection.sendPath(pathId, {
    stroke: this.getStrokeProperties(),
    points: this._points
  }, done);

  if(done) {
    this.paths.push(this._points);
    this._points = [];
    ++this._pathCount;
  }
};

/**
 * This function shouldn't be called directly; it sets the events for the
 * canvas.
 */
CanvasHandler.prototype._manageMouseEvents = function() {
  let mouseMoveHandler = this._mouseMoveHandler.bind(this);
  let translate = this.translate.bind(this);

  this.canvas.addEventListener('mousedown', (e) => {
    var point = translate(e);
    this.ctx.beginPath();
    this.ctx.moveTo(point.x, point.y);

    this._points.push(point);
    this._update(false);

    this.canvas.addEventListener('mousemove', mouseMoveHandler);
  });

  this.canvas.addEventListener('mouseup', (e) => {
    this.canvas.removeEventListener('mousemove', mouseMoveHandler);

    this.ctx.stroke();
    this._update(true);
  });
};

CanvasHandler.prototype.getStrokeProperties = function() {
  return {
    lineWidth: this.ctx.lineWidth,
    strokeStyle: this.ctx.strokeStyle,
    lineJoin: this.ctx.lineJoin,
    lineCap: this.ctx.lineCap
  };
};

CanvasHandler.prototype.setStrokeProperties = function(props) {
  this.ctx.lineWidth = props.lineWidth;
  this.ctx.strokeStyle = props.strokeStyle;
  this.ctx.lineJoin = props.lineJoin;
  this.ctx.lineCap =  props.lineCap;
};
