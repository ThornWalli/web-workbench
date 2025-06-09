import Brush from '../Brush';

import { drawDots } from '../../utils/paint';
import { ipoint } from '@js-basics/vector';

export default class Dots extends Brush {
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
}
