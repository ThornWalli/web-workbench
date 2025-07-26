import { hslToRgb } from '../../utils/color';

export interface IColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export default class Color implements IColor {
  static readonly TRANSPARENT = new Color(0, 0, 0, 0);
  static readonly TYPE = 'Color';

  static fromHex(hex: string): Color {
    if (hex.length === 4) {
      // Convert shorthand hex to full hex
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = parseInt(hex.slice(7, 9), 16);
    return new Color(r, g, b, !isNaN(a) ? a : 255);
  }

  static fromHsl(h: number, s: number, l: number, a: number = 255): Color {
    const { r, g, b } = hslToRgb(h, s, l);
    return new Color(r, g, b, a);
  }

  static isValidHex(hex: string): boolean {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hex);
  }

  r: number;

  // eslint-disable-next-line complexity
  constructor(
    r:
      | number
      | [number, number, number, number]
      | string
      | {
          r: number;
          g: number;
          b: number;
          a: number;
        },
    public g: number = 0,
    public b: number = 0,
    public a: number = 255
  ) {
    if (Array.isArray(r)) {
      [this.r, this.g, this.b, this.a] = r;
    } else if (typeof r === 'string') {
      const color = Color.fromHex(r);
      this.r = color.r;
      this.g = color.g;
      this.b = color.b;
      this.a = color.a;
    } else if (typeof r === 'object') {
      this.r = r.r || 0;
      this.g = r.g || 0;
      this.b = r.b || 0;
      this.a = r.a !== undefined ? r.a : 255;
    } else {
      this.r = r;
      this.g = g || 0;
      this.b = b || 0;
      this.a = a === undefined ? 255 : a;
    }

    // Ensure values are within the range of 0-255
    this.r = Math.min(Math.max(this.r, 0), 255);
    this.g = Math.min(Math.max(this.g, 0), 255);
    this.b = Math.min(Math.max(this.b, 0), 255);
    this.a = Math.min(Math.max(this.a, 0), 255);
  }

  toInverted(): Color {
    return new Color(255 - this.r, 255 - this.g, 255 - this.b, this.a);
  }

  toJSON() {
    return {
      _type: Color.TYPE,
      r: this.r,
      g: this.g,
      b: this.b,
      a: this.a
    };
  }

  toHex(): string {
    return `#${this.toRGBA()
      .map(c => c.toString(16).padStart(2, '0'))
      .join('')}`;
  }

  toRGB(): [number, number, number] {
    return [this.r, this.g, this.b];
  }

  toRGBA(): [number, number, number, number] {
    return [...this.toRGB(), this.a];
  }

  toCSSRGB(): [number, number, number] {
    return [...this.toRGB()];
  }

  toCSSRGBA(): [number, number, number, number] {
    return [...this.toRGB(), this.a / 255];
  }

  toHsl(): [number, number, number] {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number = 0,
      s: number = 0;

    const l = (max + min) / 2;
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [Math.round(h * 360), s, l];
  }
  toHsla(): [number, number, number, number] {
    const [h, s, l] = this.toHsl();
    return [h, s, l, this.a];
  }

  toHsv(): [number, number, number] {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number = 0,
      s: number = 0;
    const v = max;
    const d = max - min;
    if (max !== 0) {
      s = d / max; // s
    } else {
      // r = g = b = 0 // achromatic
      return [0, 0, 0];
    }
    if (max === min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [Math.round(h * 360), s, v];
  }
  toHsva(): [number, number, number, number] {
    const [h, s, v] = this.toHsv();
    return [h, s, v, this.a];
  }

  // #region HSL

  getHslaHue(): number {
    const [hue] = this.toHsl();
    return hue;
  }
  getHslaSaturation(): number {
    const [saturation] = this.toHsl();
    return saturation;
  }
  getHslaLightness(): number {
    const [lightness] = this.toHsl();
    return lightness;
  }

  setHslaHue(h: number): Color {
    const [hue, saturation, lightness] = this.toHsl();
    return Color.fromHsl(hue + h, saturation, lightness, this.a);
  }
  setHslaSaturation(s: number): Color {
    const [hue, saturation, lightness] = this.toHsl();
    return Color.fromHsl(hue, saturation + s, lightness, this.a);
  }
  setHslaLightness(l: number): Color {
    const [hue, saturation, lightness] = this.toHsl();
    return Color.fromHsl(hue, saturation, lightness + l, this.a);
  }

  // #endregion

  equals(other: Color): boolean {
    return (
      this.r === other.r &&
      this.g === other.g &&
      this.b === other.b &&
      this.a === other.a
    );
  }

  clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }
}
