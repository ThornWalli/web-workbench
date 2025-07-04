import BrushDescription from '../BrushDescription';

export default class Circle extends BrushDescription {
  override getScaledSize(scaled = false) {
    const size = this.getSize();
    if (scaled) {
      return size * this.scale;
    }
    return size;
  }
}
