import Tool from './Tool';

export default class Fill extends Tool {
  // eslint-disable-next-line complexity
  fill (x, y, color) {
    const stack = [
      [
        x, y
      ]
    ];
    let o = 0;
    let value;
    let i;
    let x_;
    let y_;
    let color_;
    const startColor = this._app.canvas.getColorFromPixel(x, y, true);
    const a = [
      [
        -1, 0
      ], [
        1, 0
      ], [
        0, -1
      ], [
        0, 1
      ]
    ];
    while (stack.length) {
      if (o > 2000000) {
        throw new Error('FILL OVERFLOW');
      }
      value = stack.pop();
      x = value[0];
      y = value[1];
      this._app.canvas.setPixel(x, y, color, true);
      for (i = 0; i < a.length; i++) {
        x_ = x + a[Number(i)][0];
        y_ = y + a[Number(i)][1];

        if (
          x_ >= 0 &&
                    x_ < this._app.canvas.width &&
                    y_ >= 0 &&
                    y_ < this._app.canvas.height
        ) {
          color_ = this._app.canvas.getColorFromPixel(x_, y_, true);
          if (color_.is(startColor) && !color.is(color_)) {
            stack.push([
              x_, y_
            ]);
          }
        }
      }
      o++;
    }
  }

  onPointerDown (event) {
    if (!this._filling) {
      this._filling = true;
      const x = event.x;
      const y = event.y;
      const color = this._app.primaryColor;
      this._app.canvas.addRenderAction(() => {
        console.log('color', x, y, color);
        this.fill(x, y, color);
        this._filling = false;
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
