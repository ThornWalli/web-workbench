import { rectangle as drawRectangle } from '../paintUtils';
import Color from '../Color';

import { getBrushByIndex } from '../Brush';
import Brush from './Brush';

export default class GeometryBrush extends Brush {
  constructor (options) {
    super(options);
    this.COLOR_TRANSPARENT = new Color(Color.COLOR_TRANSPARENT);
    this.filled = false;
    // Anchors
    this.selectedAnchor = null;
    this.anchors = [];
    this.anchorBrush = new (getBrushByIndex(0))({
      app: this._app,
      size: 1,
      primaryColor: new Color(Color.COLOR_BLACK),
      secondaryColor: new Color(Color.COLOR_WHITE)
    });
  }

  onPointerDown (event) {
    this.startEvent = event;
  }

  drawAnchors () {
    const data = [].concat(this.anchorBrush.data);
    this.anchors.forEach((vector) => {
      this.drawAnchor(vector, data);
    });
  }

  drawAnchor (vector, data) {
    vector.intersectMap = {};
    drawRectangle(
      (x, y, filled) => {
        let color = this._app.canvas.getColorFromPixel(x, y);
        if (color.alpha === 0) {
          color = filled
            ? this.anchorBrush.secondaryColor
            : this.anchorBrush.primaryColor;
        } else {
          color.invert();
        }
        vector.intersectMap[x] = vector.intersectMap[x] || {};
        vector.intersectMap[x][y] = true;
        Brush.drawBrush({
          color,
          data,
          x,
          y,
          app: this._app
        });
      },
      vector.x - 5,
      vector.y - 5,
      10,
      10,
      {
        strokeSize: 1,
        filled: true
      }
    );
  }

  getAnchorByPosition (x, y) {
    return this.anchors.find((anchor) => {
      if (anchor.intersectAnchor(x, y)) {
        return anchor;
      }
    });
  }

  addAnchor (x, y) {
    const anchor = new Anchor(x, y, this.anchorBrush);
    this.anchors.push(anchor);
    return anchor;
  }

  reset () {
    this.anchors = [];
    this.selectedAnchor = null;
  }
}

class Anchor {
  constructor (x, y, brush) {
    this.x = x;
    this.y = y;
    this.brush = brush;
  }

  intersectAnchor (x, y) {
    return this.intersectMap && this.intersectMap[x] && this.intersectMap[x][y];
  }
}

export { Anchor };
