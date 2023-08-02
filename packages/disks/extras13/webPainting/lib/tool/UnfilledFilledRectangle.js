import { rectangle as drawRectangle } from '../paintUtils';
import Brush from './Brush';
import GeometryBrush from './GeometryBrush';

export default class UnfilledFilledRectangle extends GeometryBrush {
  onPointerMove (event) {
    const x = event.x - this.startEvent.x;
    const y = event.y - this.startEvent.y;
    this._app.canvas.addPassiveRenderAction(() => {
      drawRectangle(
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
        this.startEvent.x,
        this.startEvent.y,
        x,
        y,
        {
          strokeSize: this.filled ? 0 : this._brush.data.length,
          filled: this.filled
        }
      );
    });
    return {
      render: true
    };
  }

  onPointerUp (event) {
    const x = event.x - this.startEvent.x;
    const y = event.y - this.startEvent.y;
    this._app.canvas.addRenderAction(() => {
      drawRectangle(
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
        this.startEvent.x,
        this.startEvent.y,
        x,
        y,
        {
          strokeSize: this.filled ? 0 : this._brush.data.length,
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
