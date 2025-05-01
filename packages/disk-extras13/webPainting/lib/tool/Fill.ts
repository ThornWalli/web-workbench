import type Color from '../Color';
import type ExtendedPointerEvent from '../ExtendedPointerEvent';
import Tool from './Tool';

export default class Fill extends Tool {
  filling = false;
  // eslint-disable-next-line complexity
  fill(x: number, y: number, color: Color) {
    if (!this.app.canvas) {
      throw new Error('Canvas not found');
    }
    const stack: number[][] = [[x, y]];
    let o = 0;
    let value: number[] | undefined;
    let i;
    let x_;
    let y_;
    let color_;
    const startColor = this.app.canvas?.getColorFromPixel(x, y, true);
    const a = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ];
    while (stack.length) {
      if (o > 2000000) {
        throw new Error('FILL OVERFLOW');
      }
      value = stack.pop();
      if (!value) {
        throw new Error('FILL OVERFLOW');
      }
      x = value[0];
      y = value[1];
      this.app.canvas?.setPixel(x, y, color);
      for (i = 0; i < a.length; i++) {
        x_ = x + a[Number(i)][0];
        y_ = y + a[Number(i)][1];

        if (
          x_ >= 0 &&
          x_ < this.app.canvas?.width &&
          y_ >= 0 &&
          y_ < this.app.canvas?.height
        ) {
          color_ = this.app.canvas?.getColorFromPixel(x_, y_, true);
          if (color_.is(startColor) && !color.is(color_)) {
            stack.push([x_, y_]);
          }
        }
      }
      o++;
    }
  }

  override onPointerDown(e: ExtendedPointerEvent) {
    if (!this.filling) {
      this.filling = true;
      const x = e.x;
      const y = e.y;
      const color = this.app.colorSelect.primaryColor;
      this.app.canvas?.addRenderAction(() => {
        this.fill(x, y, color);
        this.filling = false;
      });
      return {
        save: true,
        render: true
      };
    }
    return {
      events: false
    };
  }
}
