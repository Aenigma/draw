class CanvasLayer {
  constructor(canvas) {
    this.layer = canvas.cloneNode(true);
    this.ctx = this.layer.getContext('2d');
    //this.dirty = false;
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class CanvasHandler {
  constructor(canvas, cursor) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    this.cursor = cursor;

    this.layers = [
      new CanvasLayer(this.canvas),
      new CanvasLayer(this.canvas),
      new CanvasLayer(this.canvas)
    ];
  }

  translate(e) {
    let rect = this.canvas.getClientRects()[0];

    let x = (e.clientX - rect.left) / (rect.width / this.canvas.width);
    let y = (e.clientY - rect.top) / (rect.height / this.canvas.height);

    return new Point(x, y);
  }

  register() {
    let mouseMoveHandler = (e) => {
      let point = this.translate(e);
      let ctx = this.layers[1].ctx;

      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();

      this.redraw();
    };

    this.canvas.addEventListener('mousedown', (e) => {
      let point = this.translate(e);
      let ctx = this.layers[1].ctx;

      ctx.moveTo(point.x, point.y);
      this.canvas.addEventListener('mousemove', mouseMoveHandler);
    });

    this.canvas.addEventListener('mouseup', (e) => {
      let ctx = this.layers[1].ctx;

      let flux = this.layers[1].layer;
      let perm = this.layers[0].ctx;

      ctx.stroke();
      perm.drawImage(flux, 0, 0);
      ctx.beginPath();

      this.redraw();

      this.canvas.removeEventListener('mousemove', mouseMoveHandler);
    });
  }

  redraw() {
    requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for(let i = 0; i < this.layers.length; i++) {
        this.ctx.drawImage(this.layers[i].layer, 0, 0);
      }
    });
  }
}
