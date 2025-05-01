import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';

export default class BitmapData {
  dimension: IPoint & number = ipoint(0, 0);
  constructor(width: number, height: number) {
    this.dimension = ipoint(width, height);
  }

  get width() {
    return this.dimension.x;
  }

  get height() {
    return this.dimension.y;
  }

  /**
   * @deprecated use `width` and `height` or `toPoint` instead.
   */
  get size() {
    return this.dimension;
  }

  toPoint() {
    return this.dimension;
  }
}
