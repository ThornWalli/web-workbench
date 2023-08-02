
import { ipoint } from '@js-basics/vector';

class BitmapData {
  #size = ipoint(0, 0);
  constructor (width, height) {
    this.#size = ipoint(width, height);
  }

  get width () {
    return this.#size.x;
  }

  get height () {
    return this.#size.y;
  }

  get size () {
    return this.#size;
  }
}

export default BitmapData;
