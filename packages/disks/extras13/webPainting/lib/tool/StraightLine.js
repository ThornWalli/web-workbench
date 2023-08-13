import { line as drawLine } from '../paintUtils';
import GeometryBrush from './GeometryBrush';

export default class StraightLine extends GeometryBrush {
  onPointerDown(event) {
    if (this.selectedAnchor) {
      const selectedAnchor = this.getAnchorByPosition(event.x, event.y);
      if (selectedAnchor) {
        this.selectedAnchor = selectedAnchor;
      } else {
        this._app.canvas.addRenderAction(() => {
          this.render(false);
          this.reset();
        });
        return {
          save: true,
          render: true
        };
      }
      this._app.canvas.addPassiveRenderAction(() => {
        this.render(true);
      });
    }
    return {
      render: true
    };
  }

  onPointerMove(event, mouse) {
    if (mouse.pressed) {
      if (this.anchors.length < 1) {
        this.addAnchor(event.x, event.y);
        this.selectedAnchor = this.addAnchor(event.x, event.y);
      }
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

  render(anchor = false) {
    if (this.anchors.length) {
      drawLine(
        (x, y) => {
          const data = [].concat(this._brush.data);
          GeometryBrush.drawBrush({
            color: this._brush.primaryColor,
            data,
            x,
            y,
            app: this._app
          });
        },
        this.anchors[0].x,
        this.anchors[0].y,
        this.anchors[1].x,
        this.anchors[1].y,
        {}
      );

      // draw anchors
      if (anchor) {
        this.drawAnchors();
      }
    }
  }
}
