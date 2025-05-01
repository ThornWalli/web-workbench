import { ipoint } from '@js-basics/vector';
import type ExtendedPointerEvent from '../ExtendedPointerEvent';
import { ellipse as drawEllipse } from '../paintUtils';
import Brush, { type BrushToolOptions } from './Brush';
import GeometryBrush from './GeometryBrush';

export default class UnfilledFilledEllipse extends GeometryBrush {
  proportinalScale: boolean = false;

  constructor({
    proportinalScale,
    ...options
  }: { proportinalScale?: boolean } & BrushToolOptions) {
    super(options);
    this.proportinalScale = proportinalScale || false;
  }

  override onPointerMove(e: ExtendedPointerEvent) {
    const startEvent = this.startEvent || ipoint(0, 0);
    const x = (e.x - startEvent.x) / 2;
    let y = (e.y - startEvent.y) / 2;
    if (this.proportinalScale) {
      if ((x < 0 && y > 0) || (x > 0 && y < 0)) {
        y = x * -1;
      } else {
        y = x;
      }
    }
    if (x !== 0 && y !== 0) {
      this.app.canvas?.addPassiveRenderAction(() => {
        drawEllipse(
          (x, y, filled) => {
            const data = [...this.brush.data];
            Brush.drawBrush({
              color: filled
                ? this.brush.secondaryColor
                : this.brush.primaryColor,
              data,
              x,
              y,
              app: this.app
            });
          },
          Math.floor(startEvent.x + x),
          Math.floor(startEvent.y + y),
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
    return {};
  }

  override onPointerUp(e: ExtendedPointerEvent) {
    const startEvent = this.startEvent || ipoint(0, 0);
    const x = (e.x - startEvent.x) / 2;
    let y = (e.y - startEvent.y) / 2;
    if (this.proportinalScale) {
      if ((x < 0 && y > 0) || (x > 0 && y < 0)) {
        y = x * -1;
      } else {
        y = x;
      }
    }
    if (x !== 0 && y !== 0) {
      this.app.canvas?.addRenderAction(() => {
        drawEllipse(
          (x, y, filled) => {
            const data = [...this.brush.data];
            Brush.drawBrush({
              color: filled
                ? this.brush.secondaryColor
                : this.brush.primaryColor,
              data,
              x,
              y,
              app: this.app
            });
          },
          Math.floor(startEvent.x + x),
          Math.floor(startEvent.y + y),
          x,
          y,
          {
            filled: this.filled
          }
        );
      });
      return {
        save: true,
        render: true
      };
    }
    return {};
  }
}
