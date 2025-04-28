import type ExtendedPointerEvent from '../ExtendedPointerEvent';
import { line as drawLine } from '../paintUtils';
import Brush from './Brush';

export default class ContinuousFreehand extends Brush {
  last?: ExtendedPointerEvent;

  override onPointerDown(e: ExtendedPointerEvent) {
    return this.draw(e);
  }

  override onPointerMove(e: ExtendedPointerEvent) {
    return this.draw(e);
  }

  override onPointerUp() {
    this.last = undefined;
    return {
      save: true
    };
  }

  draw(e: ExtendedPointerEvent) {
    const x = (this.last || e).x;
    const y = (this.last || e).y;

    drawLine(
      (x: number, y: number) => {
        const data = [...this.brush.data];
        this.app.canvas?.addRenderAction(() => {
          Brush.drawBrush({
            color: this.brush.primaryColor,
            data,
            x,
            y,
            app: this.app
          });
        });
      },
      x,
      y,
      e.x,
      e.y,
      {}
    );
    this.last = e;
    return {
      render: true
    };
  }
}
