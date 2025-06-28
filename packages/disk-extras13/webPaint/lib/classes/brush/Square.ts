import { ipoint } from '@js-basics/vector';
import BrushDescription from '../BrushDescription';

import { drawRectangle } from '../../utils/paint';

export default class Square extends BrushDescription {
  override getData(size: number) {
    if (size > 1) {
      const dataSize = this.getDataSize();
      return drawRectangle(ipoint(dataSize, dataSize), this.primaryColor);
    } else if (size) {
      return new Uint8ClampedArray([
        this.primaryColor.r,
        this.primaryColor.g,
        this.primaryColor.b,
        this.primaryColor.a
      ]);
    } else {
      return new Uint8ClampedArray();
    }
  }
}
