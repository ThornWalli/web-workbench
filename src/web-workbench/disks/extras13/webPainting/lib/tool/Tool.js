export default class Tool {
  #pointerDownHold = false;

  constructor (options) {
    console.log(options);
    this._app = options.app;
    this.passive = options.passive || false;
    this.#pointerDownHold = options.pointerDownHold || false;
  }

  get pointerDownHold () {
    return this.#pointerDownHold;
  }

  deconstructor () {}

  onActive () {}
  onPointerDown () {}
  onPointerUp () {}
  onPointerMove () {}
  onContextMenu () {}

  get app () {
    return this._app;
  }

  get setPixel () {
    return this._app.activeDisplay.setPixel;
  }
}
