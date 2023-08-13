import { ipoint, calc } from '@js-basics/vector';
import { rectangle as drawRectangle } from '../paintUtils';

import Color from '../Color';
import { getBrushByIndex } from '../Brush';
import Bounds from '../Bounds';
import GeometryBrush from './GeometryBrush';
import Brush from './Brush';

export default class Magnifier extends GeometryBrush {
  constructor(options) {
    super(options);
    this.brushPrimaryColor = new Color(Color.COLOR_BLACK);
    this.brushSecondaryColor = new Color(Color.COLOR_WHITE);
    this.brush = new (getBrushByIndex(0))({
      app: this.app,
      size: 1,
      primaryColor: this.brushPrimaryColor,
      secondaryColor: this.brushSecondaryColor
    });

    this._moving = false;
  }

  onPointerMove(event) {
    const x = event.x - this.startEvent.x;
    const y = event.y - this.startEvent.y;
    if (!this._moving) {
      this._moving = true;
      this._app.canvas.addPassiveRenderAction(() => {
        drawRectangle(
          (x, y) => {
            const data = [].concat(this._brush.data);
            let color = this._app.canvas.getColorFromPixel(x, y);
            if (color.alpha === 0) {
              color = this.brushPrimaryColor;
            } else {
              color.invert();
            }
            Brush.drawBrush({
              color,
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
            strokeSize: this._brush.data.length,
            filled: false
          }
        );
        this._moving = false;
      });
    }
    return {
      render: true
    };
  }

  onPointerUp(event) {
    this._app.canvas.cleanPassiveRenderActions();

    const position = ipoint(event);
    const startPosition = ipoint(this.startEvent);
    const size = calc(() => Math.floor(position - startPosition));

    if (size.x > 0 && size.y > 0) {
      const bounds = new Bounds(startPosition, position);
      const display = this.app.display;
      const factor = calc(() =>
        Math.floor(
          (display.canvasLayout.naturalSize / size) * display.zoomFactor
        )
      );
      const center = calc(() => bounds.min + size / 2);

      this.app.display.setZoom(
        factor.x > factor.y ? factor.x : factor.y,
        center
      );
    }

    return {
      render: true
    };
  }
}
