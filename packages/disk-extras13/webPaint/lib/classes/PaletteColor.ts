import Color from './Color';

export interface IPaletteColor {
  id?: string;
  name?: string;
  color?: Color | string;
}
export default class PaletteColor {
  id: string;
  color: Color;
  constructor(
    options?: Partial<IPaletteColor | ReturnType<PaletteColor['toJSON']>>
  ) {
    const { id, color } = options || {};
    this.id = id || crypto.randomUUID();
    this.color = color ? new Color(color) : new Color(0, 0, 0);
  }
  setColor(color: Color) {
    this.color = color;
  }
  equal(paletteColor?: PaletteColor) {
    return this.id === paletteColor?.id;
  }
  toJSON() {
    return {
      _type: this.constructor.name,
      id: this.id,
      color: this.color.toJSON()
    };
  }
}
