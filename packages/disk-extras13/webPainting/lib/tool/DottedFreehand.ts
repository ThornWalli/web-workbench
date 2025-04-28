import type ExtendedPointerEvent from '../ExtendedPointerEvent';
import Brush from './Brush';

export default class DottedFreehand extends Brush {
  override onPointerDown(e: ExtendedPointerEvent) {
    const x = e.x;
    const y = e.y;
    const data = [...this.brush.data];
    this.app.canvas?.addRenderAction(() => {
      Brush.drawBrush({
        color: this.brush.primaryColor,
        x,
        y,
        data,
        app: this.app
      });
    });
    return {
      save: true,
      render: true
    };
  }
}
