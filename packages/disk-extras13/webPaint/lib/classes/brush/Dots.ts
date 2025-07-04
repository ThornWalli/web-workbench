import BrushDescription from '../BrushDescription';

export default class Dots extends BrushDescription {
  override getScaledSize(scaled = false) {
    const size = (this.getSize() - 1) * 2 + 1;
    if (scaled) {
      return size * this.scale;
    }
    return size;
  }
}
