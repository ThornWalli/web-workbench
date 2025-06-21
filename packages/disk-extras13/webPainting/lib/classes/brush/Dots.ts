import BrushDescription from '../BrushDescription';

import { drawDots } from '../../utils/paint';
import { ipoint } from '@js-basics/vector';

export default class Dots extends BrushDescription {
  override getDataSize(scaled = false) {
    const size = ipoint(() => (this.getSize() - 1) * 2 + 1);
    if (scaled) {
      return ipoint(() => size * this.scale);
    }
    return size;
  }
  override getData() {
    return drawDots(this.getDataSize(), this.primaryColor);
  }

  override get data() {
    return this.getData();
  }
}
