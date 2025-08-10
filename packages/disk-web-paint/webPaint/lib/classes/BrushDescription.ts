import Color from '@web-workbench/core/classes/Color';

export default class BrushDescription {
  private size: number;

  primaryColor: Color;
  secondaryColor: Color;

  scale: number = 1; // Default scale factor

  constructor(
    options: {
      size?: number;
      primaryColor?: Color;
      secondaryColor?: Color;
    } = {}
  ) {
    const { size, primaryColor, secondaryColor } = options;
    this.size = size !== undefined ? size : 1;

    this.primaryColor = primaryColor || new Color(0, 0, 0);
    this.secondaryColor = secondaryColor || new Color(255, 255, 255);
  }

  getSize() {
    return this.size;
  }

  async setSize(size: number) {
    this.size = size;
  }

  getScaledSize(scaled = false) {
    const size = this.getSize();
    if (scaled) {
      return size * this.scale;
    }
    return size;
  }
}
