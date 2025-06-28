import Color from './Color';

export default class PaletteColor {
  id: string;
  color: Color;
  constructor(options?: { id?: string; color?: Color }) {
    const { id, color } = options || {};
    this.id = id || crypto.randomUUID();
    this.color = color || new Color(0, 0, 0);
  }
  setColor(color: Color) {
    this.color = color;
  }
  equal(paletteColor?: PaletteColor) {
    return this.id === paletteColor?.id;
  }
  toJSON() {
    return {
      id: this.id,
      color: this.color.toJSON()
    };
  }
}
