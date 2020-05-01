import Brush from './Brush';

export default class DottedFreehand extends Brush {
  onPointerDown (event) {
    const x = event.x;
    const y = event.y;
    const data = [].concat(this._brush.data);
    this._app.canvas.addRenderAction(() => {
      Brush.drawBrush({
        color: this._brush.primaryColor,
        x,
        y,
        data,
        app: this._app
      });
    });
    return {
      save: true,
      render: true
    };
  }
}
