import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';

export default class Anchor {
  dimension = ipoint(11, 11);
  position = ipoint(0, 0);
  intersectMap?: boolean[][];
  selected: boolean = false;

  constructor(position: IPoint & number) {
    this.position = ipoint(position.x, position.y);
  }

  intersect(position: IPoint & number) {
    const xOverlap =
      position.x < this.position.x + this.dimension.x &&
      position.x + this.dimension.x > this.position.x;

    const yOverlap =
      position.y < this.position.y + this.dimension.y &&
      position.y + this.dimension.y > this.position.y;

    return xOverlap && yOverlap;
  }
}
