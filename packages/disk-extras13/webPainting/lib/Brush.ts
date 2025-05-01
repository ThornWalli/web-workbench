import type App from './App';
import Color from './Color';
import * as paintUtils from './paintUtils';
import { COLOR, COLOR_VALUE } from './types';

class Brush {
  app: App;
  _size: number;
  lowres: boolean;

  _primaryColor: Color;
  _secondaryColor: Color;
  _data: number[][];

  constructor({
    app,
    size,
    lowres,

    primaryColor,
    secondaryColor
  }: {
    app: App;
    size?: number;
    lowres?: boolean;

    primaryColor?: Color;
    secondaryColor?: Color;
  }) {
    this.app = app;
    this._size = size !== undefined ? size : 1;
    this.lowres = lowres !== undefined ? lowres : true;
    this._data = this.getScaledData(this._size);

    this._primaryColor = primaryColor || new Color(COLOR_VALUE[COLOR.BLACK]);
    this._secondaryColor =
      secondaryColor || new Color(COLOR_VALUE[COLOR.WHITE]);
  }

  get size() {
    return this._size;
  }

  set size(size: number) {
    this._size = size;
    this._data = this.getScaledData(this._size);
  }

  get data() {
    return this._data;
  }
  set data(data: number[][]) {
    this._data = data;
  }

  /**
   * Get primary Color from App.
   * @return {Color}
   */
  get primaryColor() {
    return this._primaryColor || this.app.colorSelect.primaryColor;
  }

  /**
   * Get secondary Color from App.
   * @return {Color}
   */
  get secondaryColor() {
    return this._secondaryColor || this.app.colorSelect.secondaryColor;
  }

  /**
   * @override
   */
  getData(size: number) {
    return Brush.scale([], size);
  }

  getScaledData(size = 1) {
    return Brush.scale(this.getData(size), this.app.density);
  }

  static scale(data: number[][], scale: number) {
    const result: number[][] = [];
    for (let x = 0; x < data.length * scale; x++) {
      result.push([]);
      for (let y = 0; y < data[0].length * scale; y++) {
        result[Number(x)].push(
          data[Math.floor(x / scale)][Math.floor(y / scale)]
        );
      }
    }
    return result;
  }

  static scaleAsCopy(data: number[][], scale: number) {
    const result: number[][] = [];
    for (let x = 0; x < data.length * scale; x++) {
      result.push([]);
      for (let y = 0; y < data[0].length * scale; y++) {
        result[Number(x)].push(data[x % data.length][y % data[0].length]);
      }
    }
    return result;
  }
}

class Circle extends Brush {
  override getData(size: number) {
    if (size > 1) {
      return drawCircle(size);
    } else if (size) {
      return [[1]];
    } else {
      return [];
    }
  }
}

function drawCircle(size: number) {
  size = (size - 1) * 2;
  const data = Array(size + 1);
  for (let i = 0; i < size + 1; i++) {
    data[Number(i)] = Array(size + 1).fill(0);
  }
  paintUtils.ellipse(
    (x: number, y: number) => {
      data[Math.round(x)][Math.round(y)] = 1;
    },
    size / 2,
    size / 2,
    size / 2,
    size / 2,
    {
      filled: true
    }
  );
  return data;
}

function drawDots(size: number) {
  const data = drawCircle(size + 2);
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[Number(i)].length; j++) {
      if (data[Number(i)][Number(j)] > 0 && Math.random() < 0.15 / size) {
        data[Number(i)][Number(j)] = 1;
      } else {
        data[Number(i)][Number(j)] = 0;
      }
    }
  }
  return data;
}

function drawRectangle(size: number) {
  const data = Array(size + 1);
  for (let i = 0; i < size + 1; i++) {
    data[Number(i)] = Array(size + 1).fill(0);
  }
  paintUtils.rectangle(
    (x, y) => {
      data[Math.round(x)][Math.round(y)] = 1;
    },
    0,
    0,
    size,
    size,
    {
      filled: true
    }
  );
  return data;
}
class Rectangle extends Brush {
  override getData(size: number) {
    return drawRectangle(size);
  }
}
class Dotted extends Brush {
  override getData(size: number) {
    return drawDots(size);
  }

  override get data() {
    this._data = this.getScaledData(this._size);
    return this._data;
  }
}

function getBrushByIndex(index: number) {
  return [Circle, Rectangle, Dotted][Number(index)];
}

export default Brush;
export { getBrushByIndex };
