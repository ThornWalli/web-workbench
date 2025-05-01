import type ExtendedPointerEvent from '../ExtendedPointerEvent';
import { line as drawLine } from '../paintUtils';
import type { PointerOptions } from '../types';
import GeometryBrush from './GeometryBrush';

export default class StraightLine extends GeometryBrush {
  override onPointerDown(e: ExtendedPointerEvent) {
    if (this.selectedAnchor) {
      const selectedAnchor = this.getAnchorByPosition(e.x, e.y);
      if (selectedAnchor) {
        this.selectedAnchor = selectedAnchor;
      } else {
        this.app.canvas?.addRenderAction(() => {
          this.render(false);
          this.reset();
        });
        return {
          save: true,
          render: true
        };
      }
      this.app.canvas?.addPassiveRenderAction(() => {
        this.render(true);
      });
    }
    return {
      render: true
    };
  }

  override onPointerMove(e: ExtendedPointerEvent, { mouse }: PointerOptions) {
    if (mouse?.pressed) {
      if (this.anchors.length < 1) {
        this.addAnchor(e.x, e.y);
        this.selectedAnchor = this.addAnchor(e.x, e.y);
      }
      if (this.selectedAnchor) {
        this.selectedAnchor.x = e.x;
        this.selectedAnchor.y = e.y;
      }
      this.app.canvas?.addPassiveRenderAction(() => {
        this.render(true);
      });
    }
    return {
      render: true
    };
  }

  render(anchor = false) {
    if (this.anchors.length) {
      drawLine(
        (x: number, y: number) => {
          const data = [...this.brush.data];
          GeometryBrush.drawBrush({
            color: this.brush.primaryColor,
            data,
            x,
            y,
            app: this.app
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
