import type { Cursor } from './Cursor';
import {
  PointerA as CursorPointerA,
  PointerMoonCity as CursorPointerMoonCity,
  Crosshair as CursorCrosshair,
  Wait as CursorWait,
  CURSOR_TYPES
} from './Cursor';

interface Cursors {
  wait: Cursor;
  default: Cursor;
}
export default class CursorWrapper {
  cursors: Cursors;
  current?: Cursor;

  constructor() {
    this.cursors = {
      wait: this.getCursor(CURSOR_TYPES.WAIT),
      default: this.getCursor(CURSOR_TYPES.POINTER_1)
    };
    this.current = this.cursors.default;
  }

  setWait(wait: boolean) {
    if (wait) {
      this.current = this.cursors.wait;
    } else {
      this.current = this.cursors.default;
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

  setCurrent(type?: string) {
    if (!type) {
      this.current = this.cursors.default;
    } else {
      this.current = this.getCursor(type);
    }
  }
}
