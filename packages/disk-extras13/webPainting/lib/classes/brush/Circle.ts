import { drawCircle } from '../../utils/paint';
import BrushDescription from '../BrushDescription';
import { ipoint } from '@js-basics/vector';

export default class Circle extends BrushDescription {
  override getDataSize(scaled = false) {
    const size = this.getSize();
    if (scaled) {
      return size * this.scale;
    }
    return size;
  }
  override getData(size: number) {
    if (size > 0) {
      if (size > circleBrushes.length - 1) {
        return drawCircle(
          ipoint(this.getDataSize(), this.getDataSize()),
          this.primaryColor
        );
      } else {
        size--;
        const data = circleBrushes[size].map(value => {
          if (value === 1) {
            return [
              this.primaryColor.r,
              this.primaryColor.g,
              this.primaryColor.b,
              this.primaryColor.a
            ];
          }
          return [0, 0, 0, 0];
        });
        return new Uint8ClampedArray(data.flat());
      }
    } else {
      return new Uint8ClampedArray();
    }
  }
}

const circleBrushes = [
  [1],
  [1, 1, 1, 1],
  /**
        0, 1, 0,
        1, 1, 1,
        0, 1, 0
       */
  [0, 1, 0, 1, 1, 1, 0, 1, 0],
  /**
      0, 1, 1, 0,
      1, 1, 1, 1,
      1, 1, 1, 1,
      0, 1, 1, 0
      */
  [0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0],
  /**
      0, 1, 1, 1, 0,
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
      0, 1, 1, 1, 0
      */
  [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
  /**
      0, 0, 1, 1, 0, 0,
      0, 1, 1, 1, 1, 0,
      1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1,
      0, 1, 1, 1, 1, 0,
      0, 0, 1, 1, 0, 0
      */
  [
    0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0
  ],
  /**
    0, 0, 1, 1, 1, 1, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 0,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    0, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 1, 1, 1, 1, 0, 0,
   */
  [
    0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,
    1, 1, 1, 1, 0, 0
  ]
];
