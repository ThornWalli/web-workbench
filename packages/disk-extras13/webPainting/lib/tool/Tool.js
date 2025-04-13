export default class Tool {
  _pointerDownHold = false;

  constructor(options) {
    this._app = options.app;
    this.passive = options.passive || false;
    this._pointerDownHold = options.pointerDownHold || false;
  }

  get pointerDownHold() {
    return this._pointerDownHold;
  }

  deconstructor() {
    /* empty */
  }

  onActive() {
    /* empty */
  }

  onPointerDown() {
    /* empty */
  }

  onPointerUp() {
    /* empty */
  }

  onPointerMove() {
    /* empty */
  }

  onContextMenu() {
    /* empty */
  }

  get app() {
    return this._app;
  }

  get setPixel() {
    return this._app.activeDisplay.setPixel;
  }
}
