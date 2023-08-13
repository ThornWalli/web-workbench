import Tool from './Tool';

export default class BrushTool extends Tool {
  constructor(options) {
    super(options);
    this._brush = options.brush;
  }

  get brush() {
    return this._brush;
  }

  set brush(brush) {
    this._brush = brush;
  }

  static drawBrush({ x, y, data, app, color }) {
    x = Math.floor(x - data[0].length / 2 + 1);
    y = Math.floor(y - data.length / 2);
    const points = [];
    for (let i = 0; i < data[0].length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (data[Number(j)][Number(i)] > 0 && color.alpha) {
          app.canvas.setPixel(x + i, y + j, color);
          points.push([x + i, y + j]);
        } else if (data[Number(j)][Number(i)] < 0) {
          app.canvas.setPixel(x + i, y + j);
        }
      }
    }
    return points;
  }
}
