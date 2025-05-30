import { clamp } from '../utils/math';

export default class Color {
  _red = 0;
  _green = 0;
  _blue = 0;
  _alpha = 255;

  COLOR_BLACK = [0, 0, 0, 255];
  COLOR_WHITE = [255, 255, 255, 255];
  COLOR_TRANSPARENT = [0, 0, 0, 0];

  constructor(red = 0, green = 0, blue = 0, alpha = 255) {
    this.set(red, green, blue, alpha);
  }

  set(red = 0, green = 0, blue = 0, alpha = 255) {
    if (Array.isArray(red)) {
      alpha = red[3];
      blue = red[2];
      green = red[1];
      red = red[0];
    }
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha === undefined ? 255 : alpha;
  }

  get r() {
    return this._red;
  }

  get red() {
    return this._red;
  }

  set red(red) {
    this._red = clamp(red, 0, 255);
  }

  get g() {
    return this._green;
  }

  get green() {
    return this._green;
  }

  set green(green) {
    this._green = clamp(green, 0, 255);
  }

  get blue() {
    return this._blue;
  }

  get b() {
    return this._blue;
  }

  set blue(blue) {
    this._blue = clamp(blue, 0, 255);
  }

  get a() {
    return this._alpha;
  }

  get alpha() {
    return this._alpha;
  }

  set alpha(alpha) {
    this._alpha = clamp(alpha, 0, 255);
  }

  get sum() {
    return this._red + this._blue + this._green + this._alpha;
  }

  toRGB() {
    return `rgb(${this._red},${this._green},${this._blue})`;
  }

  toRGBA() {
    return `rgba(${this._red},${this._green},${this._blue},${
      this._alpha / 255
    })`;
  }

  toJSON() {
    return {
      red: this.red,
      green: this.green,
      blue: this.blue,
      alpha: this.alpha
    };
  }

  is(color: Color) {
    return (
      this.red === color.red &&
      this.blue === color.blue &&
      this.green === color.green &&
      this.alpha === color.alpha
    );
  }

  /**
   * Inverts self.
   * @return {Color}
   */
  invert() {
    this._red = 255 - this._red;
    this._green = 255 - this._green;
    this._blue = 255 - this._blue;
    return this;
  }

  /**
   * Added Color.
   * @param {Color} value
   */
  add(value: Color) {
    this.red = clamp(this.red + value.red, 0, 255);
    this.green = clamp(this.green + value.green, 0, 255);
    this.blue = clamp(this.blue + value.blue, 0, 255);
  }

  /**
   * Subtract Color.
   * @param {Color} value
   */
  subtract(value: Color) {
    this.red = clamp(this.red - value.red, 0, 255);
    this.green = clamp(this.green - value.green, 0, 255);
    this.blue = clamp(this.blue - value.blue, 0, 255);
  }

  /**
   * Multiply Color.
   * @param {Color} value
   */
  multiply(value: Color) {
    this.red = clamp(this.red * value.red, 0, 255);
    this.green = clamp(this.green * value.green, 0, 255);
    this.blue = clamp(this.blue * value.blue, 0, 255);
  }

  /**
   * Multiply Color.
   * @param {Color} value
   */
  divide(value: Color) {
    this.red = clamp(this.red / value.red, 0, 255);
    this.green = clamp(this.green / value.green, 0, 255);
    this.blue = clamp(this.blue / value.blue, 0, 255);
  }
}
