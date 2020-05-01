import { ellipse as drawEllipse } from '../paintUtils';
import Brush from './Brush';
import GeometryBrush from './GeometryBrush';

export default class UnfilledFilledEllipse extends GeometryBrush {
  constructor (options) {
    super(options);
    this._proportinalScale = false;
  }

  // eslint-disable-next-line complexity
  onPointerMove (event) {
    const x = (event.x - this.startEvent.x) / 2;
    let y = (event.y - this.startEvent.y) / 2;
    if (this._proportinalScale) {
      if ((x < 0 && y > 0) || (x > 0 && y < 0)) {
        y = x * -1;
      } else {
        y = x;
      }
    }
    if (x !== 0 && y !== 0) {
      this._app.canvas.addPassiveRenderAction(() => {
        drawEllipse(
          (x, y, filled) => {
            const data = [].concat(this._brush.data);
            Brush.drawBrush({
              color: filled ? this._brush.secondaryColor : this._brush.primaryColor,
              data,
              x,
              y,
              app: this._app
            });
          },
          Math.floor(this.startEvent.x + x),
          Math.floor(this.startEvent.y + y),
          x,
          y,
          {
            filled: this.filled
          }
        );
      });
      return {
        render: true
      };
    }
  }

  // eslint-disable-next-line complexity
  onPointerUp (event) {
    const x = (event.x - this.startEvent.x) / 2;
    let y = (event.y - this.startEvent.y) / 2;
    if (this._proportinalScale) {
      if ((x < 0 && y > 0) || (x > 0 && y < 0)) {
        y = x * -1;
      } else {
        y = x;
      }
    }
    if (x !== 0 && y !== 0) {
      this._app.canvas.addRenderAction(() => {
        drawEllipse(
          (x, y, filled) => {
            const data = [].concat(this._brush.data);
            Brush.drawBrush({
              color: filled ? this._brush.secondaryColor : this._brush.primaryColor,
              data,
              x,
              y,
              app: this._app
            });
          },
          Math.floor(this.startEvent.x + x),
          Math.floor(this.startEvent.y + y),
          x,
          y,
          {
            strokeSize: this._brush.data.length,
            filled: this.filled
          }
        );
      });
      return {
        save: true,
        render: true
      };
    }
  }
}
