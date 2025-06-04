export class Color {
  static fromHex(hex: string): Color {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = parseInt(hex.slice(7, 9), 16);
    return new Color(r, g, b, !isNaN(a) ? a : 255);
  }

  r: number;

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
    }

    // Ensure values are within the range of 0-255
    this.r = Math.min(Math.max(this.r, 0), 255);
    this.g = Math.min(Math.max(this.g, 0), 255);
    this.b = Math.min(Math.max(this.b, 0), 255);
    this.a = Math.min(Math.max(this.a, 0), 255);
  }

  toJSON() {
    return {
      _type: this.constructor.name,
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
}
