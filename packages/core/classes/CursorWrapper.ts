import type { Cursor } from './Cursor';
import {
  PointerA as CursorPointerA,
  PointerMoonCity as CursorPointerMoonCity,
  Crosshair as CursorCrosshair,
  Wait as CursorWait,
  CURSOR_TYPES
} from './Cursor';

export default class CursorWrapper {
  _wait;
  _tmp?: Cursor;
  _default: Cursor;
  current?: Cursor;

  constructor() {
    this._wait = this.getCursor(CURSOR_TYPES.WAIT);
    this.current = this._default = this.getCursor(CURSOR_TYPES.POINTER_1);
  }

  setWait(wait: boolean) {
    if (!this._tmp && wait) {
      this._tmp = this.current;
      this.current = this._wait;
    } else {
      this.current = this._tmp;
      this._tmp = undefined;
    }
  }

  getCursor(type: string) {
    return new {
      [CURSOR_TYPES.POINTER_1]: CursorPointerA,
      [CURSOR_TYPES.POINTER_MOONCITY]: CursorPointerMoonCity,
      [CURSOR_TYPES.WAIT]: CursorWait,
      [CURSOR_TYPES.CROSSHAIR]: CursorCrosshair
    }[type]();
  }

  setCurrent(type: string) {
    console.log('setCurrent', type);
    if (!type) {
      this.current = this._default;
    } else {
      this.current = this.getCursor(type);
    }
  }
}
