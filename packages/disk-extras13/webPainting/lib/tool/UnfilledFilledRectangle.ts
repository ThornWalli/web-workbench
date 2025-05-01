import { ipoint } from '@js-basics/vector';
import { rectangle as drawRectangle } from '../paintUtils';
import Brush from './Brush';
import GeometryBrush from './GeometryBrush';
import type ExtendedPointerEvent from '../ExtendedPointerEvent';

export default class UnfilledFilledRectangle extends GeometryBrush {
  override onPointerMove(e: ExtendedPointerEvent) {
    const startEvent = this.startEvent || ipoint(0, 0);
    const x = e.x - startEvent.x;
    const y = e.y - startEvent.y;
    this.app.canvas?.addPassiveRenderAction(() => {
      drawRectangle(
        (x, y, filled) => {
          const data = [...this.brush.data];
          Brush.drawBrush({
            color: filled ? this.brush.secondaryColor : this.brush.primaryColor,
            data,
            x,
            y,
            app: this.app
          });
        },
        startEvent.x,
        startEvent.y,
        x,
        y,
        {
          strokeSize: this.filled ? 0 : this.brush.data.length,
          filled: this.filled
        }
      );
    });
    return {
      render: true
    };
  }

  override onPointerUp(e: ExtendedPointerEvent) {
    const startEvent = this.startEvent || ipoint(0, 0);
    const x = e.x - startEvent.x;
    const y = e.y - startEvent.y;
    this.app.canvas?.addRenderAction(() => {
      drawRectangle(
        (x, y, filled) => {
          const data = [...this.brush.data];
          Brush.drawBrush({
            color: filled ? this.brush.secondaryColor : this.brush.primaryColor,
            data,
            x,
            y,
            app: this.app
          });
        },
        startEvent.x,
        startEvent.y,
        x,
        y,
        {
          strokeSize: this.filled ? 0 : this.brush.data.length,
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
