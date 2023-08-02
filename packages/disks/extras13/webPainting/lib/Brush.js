import * as paintUtils from './paintUtils';

class Brush {
  constructor ({
    app,
    size = 1,
    lowres = true,

    primaryColor,
    secondaryColor
  }) {
    this._app = app;
    this._size = size;
    this._lowres = lowres;
    this._data = this.getScaledData(this._size);

    this._primaryColor = primaryColor;
    this._secondaryColor = secondaryColor;
  }

  get lowres () {
    return this._lowres;
  }

  get data () {
    return this._data;
  }

  get size () {
    return this._size;
  }

  set size (size = 1) {
    this._size = size;
    this._data = this.getScaledData(this._size);
  }

  /**
     * Get primary Color from App.
     * @return {Color}
     */
  get primaryColor () {
    return this._primaryColor || this._app.primaryColor;
  }

  /**
     * Get secondary Color from App.
     * @return {Color}
     */
  get secondaryColor () {
    return this._secondaryColor || this._app.secondaryColor;
  }

  /**
     * @override
     */
  getData (size) {
    return Brush.scale([], size);
  }

  getScaledData (size = 1) {
    return Brush.scale(this.getData(size), this._app.density);
  }

  static scale (data, scale) {
    const result = [];
    for (let x = 0; x < data.length * scale; x++) {
      result.push([]);
      for (let y = 0; y < data[0].length * scale; y++) {
        result[Number(x)].push(data[Math.floor(x / scale)][Math.floor(y / scale)]);
      }
    }
    return result;
  }

  static scaleAsCopy (data, scale) {
    const result = [];
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
  getData (size) {
    if (size > 1) {
      return drawCircle(size);
    } else if (size) {
      return [
        [
          1
        ]
      ];
    } else {
      return [];
    }
  }
}

function drawCircle (size) {
  size = (size - 1) * 2;
  const data = Array(size + 1);
  for (let i = 0; i < size + 1; i++) {
    data[Number(i)] = Array(size + 1).fill(0);
  }
  paintUtils.ellipse(
    (x, y) => {
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

function drawDots (size) {
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

function drawRectangle (size) {
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
  getData (size) {
    return drawRectangle(size);
  }
}
class Dotted extends Brush {
  getData (size) {
    return drawDots(size);
  }

  get data () {
    this._data = this.getScaledData(this._size);
    return this._data;
  }
}

function getBrushByIndex (index) {
  return [
    Circle, Rectangle, Dotted
  ][Number(index)];
}

export default Brush;
export { getBrushByIndex };
