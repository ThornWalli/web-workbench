import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import { Color } from './Color';

export default class BrushDescription {
  private size: IPoint & number;

  primaryColor: Color;
  secondaryColor: Color;
  _data: Uint8ClampedArray;

  scale: IPoint & number = ipoint(1, 1); // Default scale factor

  constructor(
    options: {
      size?: IPoint & number;
      primaryColor?: Color;
      secondaryColor?: Color;
    } = {}
  ) {
    const { size, primaryColor, secondaryColor } = options;
    this.size = size !== undefined ? size : ipoint(1, 1);

    this.primaryColor = primaryColor || new Color(0, 0, 0);
    this.secondaryColor = secondaryColor || new Color(255, 255, 255);

    this._data = this.getScaledData(this.scale);
  }

  async refresh() {
    this._data = await this.getScaledData(this.scale);
  }

  getSize() {
    return this.size;
  }

  async setSize(size: IPoint & number) {
    this.size = size;
    this._data = await this.getScaledData(this.scale);
  }

  get data() {
    return this._data;
  }

  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getData(size: IPoint & number) {
    return new Uint8ClampedArray();
  }

  getDataSize(scaled = false) {
    const size = this.getSize();
    if (scaled) {
      return ipoint(() => size * this.scale);
    }
    return size;
  }

  getScaledData(scale = ipoint(1, 1)) {
    return BrushDescription.scale(
      this.getData(this.getSize()),
      this.getDataSize(),
      scale
    );
  }

  static scale(
    data: Uint8ClampedArray,
    size: IPoint & number = ipoint(1, 1),
    scale: IPoint & number = ipoint(1, 1)
  ) {
    const result = new Uint8ClampedArray(
      size.x * scale.x * size.y * scale.y * 4
    );

    for (let i = 0; i < result.length; i += 4) {
      const _i = Math.floor(i / 4 / scale.x);
      const y = Math.floor(_i / scale.y / size.x);
      const x = Math.floor(_i % size.x);

      const sourceIndex = Math.floor((x + y * size.x) * 4);

      result[i] = data[sourceIndex];
      result[i + 1] = data[sourceIndex + 1];
      result[i + 2] = data[sourceIndex + 2];
      result[i + 3] = data[sourceIndex + 3];
    }

    return result;
  }
}
