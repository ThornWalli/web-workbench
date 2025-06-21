import type { IPoint } from '@js-basics/vector';
import BrushDescription from '../BrushDescription';

import { drawRectangle } from '../../utils/paint';

export default class Square extends BrushDescription {
  override getData(size: IPoint & number) {
    if (size.x > 1) {
      return drawRectangle(this.getDataSize(), this.primaryColor);
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
