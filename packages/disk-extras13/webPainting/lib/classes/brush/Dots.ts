import BrushDescription from '../BrushDescription';

import { drawDots } from '../../utils/paint';
import { ipoint } from '@js-basics/vector';

export default class Dots extends BrushDescription {
  override getDataSize(scaled = false) {
    const size = (this.getSize() - 1) * 2 + 1;
    if (scaled) {
      return size * this.scale;
    }
    return size;
  }
  override getData() {
    const dataSize = this.getDataSize();
    return drawDots(ipoint(dataSize, dataSize), this.primaryColor);
  }

  override get data() {
    return this.getData();
  }
}
