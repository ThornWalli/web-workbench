export default class Tool {
  #pointerDownHold = false;

  constructor (options) {
    this._app = options.app;
    this.passive = options.passive || false;
    this.#pointerDownHold = options.pointerDownHold || false;
  }

  get pointerDownHold () {
    return this.#pointerDownHold;
  }

  deconstructor () { /* empty */ }

  onActive () { /* empty */ }
  onPointerDown () { /* empty */ }
  onPointerUp () { /* empty */ }
  onPointerMove () { /* empty */ }
  onContextMenu () { /* empty */ }

  get app () {
    return this._app;
  }

  get setPixel () {
    return this._app.activeDisplay.setPixel;
  }
}
