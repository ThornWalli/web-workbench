import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import { Color } from './Color';

export default class Brush {
  private size: IPoint & number;
  /**
   * @deprecated Wird vermutlich nicht benötigt.
   */
  lowres: boolean;

  primaryColor: Color;
  secondaryColor: Color;
  data: Uint8ClampedArray;

  scale: IPoint & number = ipoint(1, 1); // Default scale factor

  constructor(
    options: {
      size?: IPoint & number;
      lowres?: boolean;
      primaryColor?: Color;
      secondaryColor?: Color;
    } = {}
  ) {
    const { size, lowres, primaryColor, secondaryColor } = options;
    this.size = size !== undefined ? size : ipoint(1, 1);
    this.lowres = lowres !== undefined ? lowres : true;

    this.primaryColor = primaryColor || new Color(0, 0, 0);
    this.secondaryColor = secondaryColor || new Color(255, 255, 255);

    this.data = this.getScaledData(this.scale);
  }

  async refresh() {
    this.data = await this.getScaledData(this.scale);
  }

  getSize() {
    return this.size;
  }

  async setSize(size: IPoint & number) {
    this.size = size;
    this.data = await this.getScaledData(this.scale);
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
    return Brush.scale(this.getData(this.getSize()), this.getDataSize(), scale);
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

  static scaleALT(data: number[][], scale: IPoint & number = ipoint(1, 1)) {
    const result: number[][] = [];
    for (let x = 0; x < data.length * scale.x; x++) {
      result.push([]);
      for (let y = 0; y < data[0].length * scale.y; y++) {
        result[Number(x)].push(
          data[Math.floor(x / scale.x)][Math.floor(y / scale.y)]
        );
      }
    }
    return result;
  }
}
