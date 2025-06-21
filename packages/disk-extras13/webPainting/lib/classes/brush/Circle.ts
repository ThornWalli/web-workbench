import { drawCircle } from '../../utils/paint';
import BrushDescription from '../BrushDescription';
import { ipoint, type IPoint } from '@js-basics/vector';

export default class Circle extends BrushDescription {
  override getDataSize(scaled = false) {
    const size = this.getSize();
    if (scaled) {
      return ipoint(() => size * this.scale);
    }
    return size;
  }
  override getData(size: IPoint & number) {
    if (size.x > 1) {
      return drawCircle(this.getDataSize(), this.primaryColor);
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
