/* eslint-disable complexity */

import { ipoint, type IPoint } from '@js-basics/vector';
import type { Color } from '../classes/Color';

export function ellipse(
  cb: (x: number, y: number, filled: boolean) => void,
  xc: number,
  yc: number,
  width: number,
  height: number,
  { filled = false, density = 0 }
) {
  if (width < 0) {
    width = Math.abs(width);
  }
  if (height < 0) {
    height = Math.abs(height);
  }

  const a2 = width * width;
  const b2 = height * height;
  const fa2 = 4 * a2;
  const fb2 = 4 * b2;
  let x;
  let y;
  let sigma;
  let i = 0;
  const cbFilled = (x: number, y: number) => {
    return cb(x, y, true);
  };
  const strokeData = [];

  for (
    x = 0, y = height, sigma = 2 * b2 + a2 * (1 - 2 * height);
    b2 * x <= a2 * y;
    x++
  ) {
    if (!density || i >= 1) {
      strokeData.push([xc + x, yc + y]);
      strokeData.push([xc - x, yc - y]);
      strokeData.push([xc - x, yc + y]);
      strokeData.push([xc + x, yc - y]);
      i = 0;
    } else {
      i += 1 / density;
    }
    if (sigma >= 0) {
      sigma += fa2 * (1 - y);
      y--;
    }
    sigma += b2 * (4 * x + 6);
  }
  i = 0;
  for (
    x = width, y = 0, sigma = 2 * a2 + b2 * (1 - 2 * width);
    a2 * y <= b2 * x;
    y++
  ) {
    if (!density || i >= 1) {
      strokeData.push([xc + x, yc + y]);
      strokeData.push([xc - x, yc + y]);
      strokeData.push([xc + x, yc - y]);
      strokeData.push([xc - x, yc - y]);
      i = 0;
    } else {
      i += 1 / density;
    }
    if (sigma >= 0) {
      sigma += fb2 * (1 - x);
      x--;
    }
    sigma += a2 * (4 * y + 6);
  }

  if (filled) {
    for (let y_ = -height; y_ <= height; y_++) {
      for (let x_ = -width; x_ <= width; x_++) {
        if (
          x_ * x_ * height * height + y_ * y_ * width * width <=
          height * height * width * width
        ) {
          cbFilled(xc + x_, yc + y_);
        }
      }
    }
  }
  strokeData.forEach(stroke => {
    cb(stroke[0], stroke[1], false);
  });
}

export function rectangle(
  cb: (x: number, y: number, filled?: boolean) => void,
  x: number,
  y: number,
  width: number,
  height: number,
  {
    strokeSize = 0,
    filled = false,
    density
  }: {
    strokeSize?: number;
    filled?: boolean;
    density?: number;
  }
) {
  if (filled) {
    const cbFilled = (x: number, y: number) => cb(x, y, true);
    for (
      let i = height < 0 ? y : y;
      height < 0 ? i >= y + height : i <= y + height;
      height < 0 ? i-- : i++
    ) {
      line(cbFilled, width < 0 ? x : x, i, x + width, i, {
        density
      });
    }
  }
  if (strokeSize > 0) {
    strokeSize = Math.floor(strokeSize / 2);
    const strokeSizeDimension = [
      width < 0 ? -strokeSize : strokeSize,
      height < 0 ? -strokeSize : strokeSize
    ];
    let last = [x - strokeSizeDimension[0], y - strokeSizeDimension[1]];
    [
      [x - strokeSizeDimension[0], y - strokeSizeDimension[1]],
      [x - strokeSizeDimension[0], y + height + strokeSizeDimension[1]],
      [x + width + strokeSizeDimension[0], y + height + strokeSizeDimension[1]],
      [x + width + strokeSizeDimension[0], y - strokeSizeDimension[1]],
      last
    ].forEach(pos => {
      line(cb, last[0], last[1], pos[0], pos[1], {
        density
      });
      last = pos;
    });
  }
}

export function line(
  cb: (x: number, y: number) => void,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  { density = 0 }
) {
  getLinePoints(x0, y0, x1, y1, density).forEach(point => {
    cb(point[0], point[1]);
  });
}

export function getLinePoints(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  density = 0
) {
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let err = (dx > dy ? dx : -dy) / 2;

  const points = [];
  let i = 0;

  while (true) {
    if (density === 0 || i >= 1) {
      points.push([x0, y0]);
      i = 0;
    } else {
      i += 1 / density;
    }
    if (x0 === x1 && y0 === y1) {
      break;
    }
    const e2 = err;
    if (e2 > -dx) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dy) {
      err += dx;
      y0 += sy;
    }
  }
  return points;
}

export function drawDots(size: IPoint & number, color: Color) {
  const data = drawCircle(size, color);
  for (let i = 0; i < data.length; i += 4) {
    if (!(data[i + 3] > 0 && Math.random() < 0.25 / ((size.x + size.y) / 2))) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }
  return data;
}

export function drawCircle(
  size: IPoint & number,
  color: Color,
  {
    filled
  }: {
    filled: boolean;
  } = { filled: true }
) {
  const realSize = ipoint(() => size - 1);
  const data = new Uint8ClampedArray(Array(size.x * size.y * 4).fill(0));

  ellipse(
    (x: number, y: number) => {
      const index = (Math.round(y) * size.x + Math.round(x)) * 4;
      data[index] = color.r; // R
      data[index + 1] = color.g; // G
      data[index + 2] = color.b; // B
      data[index + 3] = color.a; // A
    },
    realSize.x / 2,
    realSize.y / 2,
    realSize.x / 2,
    realSize.y / 2,
    {
      filled
    }
  );
  return data;
}

export function drawRectangle(
  size: IPoint & number,
  color: Color,
  {
    filled
  }: {
    filled: boolean;
  } = { filled: true }
) {
  const data = new Uint8ClampedArray(Array(size.x * size.y * 4).fill(0));

  rectangle(
    (x, y) => {
      const index = (Math.round(y) * size.x + Math.round(x)) * 4;
      data[index] = color.r; // R
      data[index + 1] = color.g; // G
      data[index + 2] = color.b; // B
      data[index + 3] = color.a; // A
    },
    0,
    0,
    size.x,
    size.y,
    {
      filled
    }
  );
  return data;
}
