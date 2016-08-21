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
