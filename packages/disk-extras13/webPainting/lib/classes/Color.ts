export class Color {
  static fromHex(hex: string): Color {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = parseInt(hex.slice(7, 9), 16);
    return new Color(r, g, b, !isNaN(a) ? a : 255);
  }

  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number = 255
  ) {}

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
