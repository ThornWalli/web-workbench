import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';

export default class Bounds {
  min: IPoint & number = ipoint(0, 0);
  max: IPoint & number = ipoint(0, 0);
  constructor(min?: IPoint & number, max?: IPoint & number) {
    this.min = min || this.min;
    this.max = max || this.max;
  }
}
