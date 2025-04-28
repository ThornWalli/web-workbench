import type App from '../App';
import type Brush from '../Brush';
import type Color from '../Color';
import Tool, { type ToolOptions } from './Tool';

export interface BrushToolOptions extends ToolOptions {
  brush: Brush;
}

export default class BrushTool extends Tool {
  brush: Brush;
  constructor({ brush, ...options }: BrushToolOptions) {
    super(options);
    this.brush = brush;
  }

  static drawBrush({
    x,
    y,
    data,
    app,
    color
  }: {
    x: number;
    y: number;
    data: number[][];
    app: App;
    color: Color;
  }) {
    x = Math.floor(x - data[0].length / 2 + 1);
    y = Math.floor(y - data.length / 2);
    const points = [];
    for (let i = 0; i < data[0].length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (data[Number(j)][Number(i)] > 0 && color.alpha) {
          app.canvas?.setPixel(x + i, y + j, color);
          points.push([x + i, y + j]);
        } else if (data[Number(j)][Number(i)] < 0) {
          app.canvas?.setPixel(x + i, y + j, color);
        }
      }
    }
    return points;
  }
}
