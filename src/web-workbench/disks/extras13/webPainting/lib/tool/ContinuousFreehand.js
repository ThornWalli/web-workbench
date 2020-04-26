import { line as drawLine } from '../paintUtils';
import Brush from './Brush';

export default class ContinuousFreehand extends Brush {
  onPointerDown (event) {
    // debugger;
    return draw.bind(this)(event);
  }

  onPointerMove (event) {
    return draw.bind(this)(event);
  }

  onPointerUp () {
    this.last = null;
    return {
      save: true
    };
  }
}

function draw (event) {
  const x = (this.last || event).x;
  const y = (this.last || event).y;

  drawLine(
    (x, y) => {
      const data = [].concat(this._brush.data);
      this._app.canvas.addRenderAction(() => {
        Brush.drawBrush({
          color: this._brush.primaryColor,
          data,
          x,
          y,
          app: this._app
        });
      });
    },
    x,
    y,
    event.x,
    event.y,
    {}
  );
  this.last = event;
  return {
    render: true
  };
}
