import { ipoint } from '@js-basics/vector';

export default class Bounds {
  min = ipoint(0, 0);
  max = ipoint(0, 0);
  constructor(min, max) {
    this.min = min || this.min;
    this.max = max || this.max;
  }
}
