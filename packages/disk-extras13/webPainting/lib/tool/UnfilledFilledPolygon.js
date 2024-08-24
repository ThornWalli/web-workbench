import { polygon as drawPolygon } from '../paintUtils';
import Brush from './Brush';
import GeometryBrush from './GeometryBrush';

export default class UnfilledFilledPolygon extends GeometryBrush {
  constructor(options) {
    super(options);
    this.status = 0;
  }

  onPointerMove(event, mouse) {
    if (mouse.pressed && this.selectedAnchor) {
      this.selectedAnchor.x = event.x;
      this.selectedAnchor.y = event.y;
      this._app.canvas.addPassiveRenderAction(() => {
        this.render(true);
      });
      return {
        render: true
      };
    }
  }

  onPointerDown(event) {
    const selectedAnchor = this.getAnchorByPosition(event.x, event.y);
    switch (this.status) {
      case 1:
        if (selectedAnchor) {
          this.selectedAnchor = selectedAnchor;
        } else {
          this.status = 2;
          this._app.canvas.addRenderAction(() => {
            this.render(false);
            this.reset();
          });
          return {
            save: true,
            render: true
          };
        }
        break;
      default:
        if (selectedAnchor && this.anchors[0] === selectedAnchor) {
          this.status = 1;
          this.selectedAnchor = selectedAnchor;
        } else {
          this.selectedAnchor =
            selectedAnchor || this.addAnchor(event.x, event.y);
        }
    }
    this._app.canvas.addPassiveRenderAction(() => {
      this.render(this.status < 2);
    });
    return {
      render: true
    };
  }

  isClosed() {
    return this.status > 0;
  }

  render(anchor = false) {
    // draw lines
    const setPixel = (x, y) => {
      const data = [].concat(this._brush.data);
      Brush.drawBrush({
        color: this._brush.primaryColor,
        data,
        x,
        y,
        app: this._app
      });
    };
    drawPolygon(setPixel, this.anchors, this.status > 0, {
      filled: this.filled
    });
    // draw anchors
    if (anchor) {
      this.drawAnchors();
    }
  }

  reset() {
    GeometryBrush.prototype.reset.apply(this, arguments);
    this.status = 0;
  }
}
