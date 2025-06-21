/* eslint-disable complexity */

import { ipoint, type IPoint } from '@js-basics/vector';
import type { Color } from '../classes/Color';

export enum STROKE_ALIGN {
  CENTER = 'center',
  INSIDE = 'inside',
  OUTSIDE = 'outside'
}

export function ellipse(
  cb: (x: number, y: number, filled: boolean) => void,
  xc: number,
  yc: number,
  width: number,
  height: number,
  { strokeSize = 0, filled = false, density = 0 }
) {
  if (width < 0) {
    width = Math.abs(width);
  }
  if (height < 0) {
    height = Math.abs(height);
  }

  const cbFilled = (x: number, y: number) => {
    return cb(x, y, true);
  };

  if (filled) {
    const pointDensity = Math.max(1, Math.round(density)); // pointDensity muss mindestens 1 sein
    width = Math.round(width);
    height = Math.round(height);

    const a2 = width * width;
    const b2 = height * height;
    const fa2 = 4 * a2;
    const fb2 = 4 * b2;
    let x;
    let y;
    let sigma;
    const fillPoints = [];

    for (
      x = 0, y = height, sigma = 2 * b2 + a2 * (1 - 2 * height);
      b2 * x <= a2 * y;
      x++
    ) {
      const currentY_pos = yc + y;
      const currentY_neg = yc - y;

      for (
        let currentX = xc - x;
        currentX <= xc + x;
        currentX += pointDensity
      ) {
        fillPoints.push([currentX, currentY_pos]);
        if (y !== 0) {
          fillPoints.push([currentX, currentY_neg]);
        }
      }

      if (sigma >= 0) {
        sigma += fa2 * (1 - y);
        y--;
      }
      sigma += b2 * (4 * x + 6);
    }

    for (
      x = width, y = 0, sigma = 2 * a2 + b2 * (1 - 2 * width);
      a2 * y <= b2 * x;
      y++
    ) {
      const currentY_pos = yc + y;
      const currentY_neg = yc - y;

      for (
        let currentX = xc - x;
        currentX <= xc + x;
        currentX += pointDensity
      ) {
        fillPoints.push([currentX, currentY_pos]);
        if (y !== 0) {
          fillPoints.push([currentX, currentY_neg]);
        }
      }

      if (sigma >= 0) {
        sigma += fb2 * (1 - x);
        x--;
      }
      sigma += a2 * (4 * y + 6);
    }

    fillPoints.forEach(fill => {
      cbFilled(fill[0], fill[1]);
    });
  }

  if (strokeSize > 0) {
    const a2 = width * width;
    const b2 = height * height;
    const fa2 = 4 * a2;
    const fb2 = 4 * b2;
    let x;
    let y;
    let sigma;
    let i = 0;
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
    strokeData.forEach(stroke => {
      cb(stroke[0], stroke[1], false);
    });
  }
}

export function rectangle(
  cb: (
    x: number,
    y: number,
    filled?: boolean,
    width?: number,
    height?: number
  ) => void,
  x: number,
  y: number,
  width: number,
  height: number,
  {
    strokeSize = 0,
    strokeAlign = STROKE_ALIGN.CENTER,
    filled = false,
    density
  }: {
    strokeAlign?: STROKE_ALIGN;
    strokeSize?: number;
    filled?: boolean;
    density?: number;
  }
) {
  if (strokeSize !== 1) {
    strokeSize = Math.floor(strokeSize / 2);
  }

  const dimension = ipoint(() => Math.abs(ipoint(width, height)));

  if (filled) {
    cb(x, y, true, dimension.x, dimension.y);
  }

  if (strokeSize > 0) {
    let strokeSizeDimension;
    switch (strokeAlign) {
      case STROKE_ALIGN.INSIDE:
        strokeSizeDimension = ipoint(
          width < 0 ? strokeSize : -strokeSize,
          height < 0 ? strokeSize : -strokeSize
        );
        break;
      case STROKE_ALIGN.OUTSIDE:
        strokeSizeDimension = ipoint(
          width < 0 ? -strokeSize : strokeSize,
          height < 0 ? -strokeSize : strokeSize
        );
        break;
      case STROKE_ALIGN.CENTER:
      default:
        strokeSizeDimension = ipoint(0, 0);
        break;
    }

    if (dimension.x > 0 && dimension.y > 0) {
      let last = [x - strokeSizeDimension.x, y - strokeSizeDimension.y];

      [
        [x - strokeSizeDimension.x, y - strokeSizeDimension.y],
        [x - strokeSizeDimension.x, y + dimension.y + strokeSizeDimension.y],
        [
          x + dimension.x + strokeSizeDimension.x,
          y + dimension.y + strokeSizeDimension.y
        ],
        [x + dimension.x + strokeSizeDimension.x, y - strokeSizeDimension.y],
        last
      ].forEach(pos => {
        line(cb, last[0], last[1], pos[0], pos[1], {
          density
        });
        last = pos;
      });
    }
  }
}

export function line(
  cb: (x: number, y: number) => void,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  options?: { density?: number }
) {
  getLinePoints(x0, y0, x1, y1, options?.density).forEach(point => {
    cb(point[0], point[1]);
  });
}

export function curve(
  cb: CallableFunction,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
  density: number = 0.001
) {
  let xu = 0.0;
  let yu = 0.0;
  let u = 0.0;
  for (u = 0.0; u <= 1.0; u += density) {
    xu =
      (1 - u) ** 3 * x1 +
      3 * u * (1 - u) ** 2 * x2 +
      3 * u ** 2 * (1 - u) * x3 +
      u ** 3 * x4;
    yu =
      (1 - u) ** 3 * y1 +
      3 * u * (1 - u) ** 2 * y2 +
      3 * u ** 2 * (1 - u) * y3 +
      u ** 3 * y4;
    cb(xu, yu);
  }
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
  if (size.x === 1 && size.y === 1) {
    return new Uint8ClampedArray([color.r, color.g, color.b, color.a]);
  }

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
      filled,
      strokeSize: 0
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
    (x, y, filled, width, height) => {
      for (let y = 0; y < height!; y++) {
        const index = Math.round(y) * width! * 4;
        data.set(
          new Uint8ClampedArray(Array(width).fill(color.toRGBA()).flat()),
          index
        );
      }
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

export function polygon(
  cb: (x: number, y: number, filled?: boolean) => void,
  nodes: { x: number; y: number }[],
  closed: boolean,
  options: {
    filled?: boolean;
    density?: number;
  } = { filled: false, density: 0 }
) {
  let lastAnchor: (typeof nodes)[number] | undefined;
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;
  let maxX = Number.MIN_VALUE;
  let maxY = Number.MIN_VALUE;
  nodes.forEach(node => {
    if (lastAnchor) {
      if (node.x > maxX) {
        maxX = node.x;
      }
      if (node.y > maxY) {
        maxY = node.y;
      }
      if (node.x < minX) {
        minX = node.x;
      }
      if (node.y < minY) {
        minY = node.y;
      }
      line(cb, lastAnchor.x, lastAnchor.y, node.x, node.y, {
        density: options.density
      });
    }
    lastAnchor = node;
  });
  if (closed) {
    const firstNode = nodes[0];
    if (lastAnchor) {
      if (firstNode.x > maxX) {
        maxX = firstNode.x;
      }
      if (firstNode.y > maxY) {
        maxY = firstNode.y;
      }
      if (firstNode.x < minX) {
        minX = firstNode.x;
      }
      if (firstNode.y < minY) {
        minY = firstNode.y;
      }
      line(cb, lastAnchor.x, lastAnchor.y, firstNode.x, firstNode.y, {
        density: options.density
      });
    }
  }
  if (options.filled) {
    const cbFilled = (x: number, y: number) => {
      return cb(x, y, true);
    };
    fillPolygon(cbFilled, nodes, {
      IMAGE_LEFT: minX,
      IMAGE_TOP: minY,
      IMAGE_RIGHT: maxX,
      IMAGE_BOTTOM: maxY
    });
  }
}

export function fillPolygon(
  cb: (x: number, y: number) => void,
  polygons: { x: number; y: number }[],
  {
    IMAGE_LEFT = 0,
    IMAGE_TOP = 0,
    IMAGE_RIGHT,
    IMAGE_BOTTOM
  }: {
    IMAGE_LEFT?: number;
    IMAGE_TOP?: number;
    IMAGE_RIGHT: number;
    IMAGE_BOTTOM: number;
  }
) {
  const polyY: number[] = [];
  const polyX: number[] = [];
  polygons.forEach(polygon => {
    polyY.push(polygon.y);
    polyX.push(polygon.x);
  });

  let nodes;
  const nodeX = Array(polygons.length);
  let pixelX;
  let pixelY;
  let i;
  let j;
  let swap;

  for (pixelY = IMAGE_TOP; pixelY < IMAGE_BOTTOM; pixelY++) {
    nodes = 0;
    j = polygons.length - 1;
    for (i = 0; i < polygons.length; i++) {
      if (
        (polyY[Number(i)] < pixelY && polyY[Number(j)] >= pixelY) ||
        (polyY[Number(j)] < pixelY && polyY[Number(i)] >= pixelY)
      ) {
        nodeX[nodes++] = Math.round(
          polyX[Number(i)] +
            ((pixelY - polyY[Number(i)]) /
              (polyY[Number(j)] - polyY[Number(i)])) *
              (polyX[Number(j)] - polyX[Number(i)])
        );
      }
      j = i;
    }

    i = 0;
    while (i < nodes - 1) {
      if (nodeX[Number(i)] > nodeX[i + 1]) {
        swap = nodeX[Number(i)];
        nodeX[Number(i)] = nodeX[i + 1];
        nodeX[i + 1] = swap;
        if (i) {
          i--;
        }
      } else {
        i++;
      }
    }

    for (i = 0; i < nodes; i += 2) {
      if (nodeX[Number(i)] >= IMAGE_RIGHT) {
        break;
      }
      if (nodeX[i + 1] > IMAGE_LEFT) {
        if (nodeX[Number(i)] < IMAGE_LEFT) {
          nodeX[Number(i)] = IMAGE_LEFT;
        }
        if (nodeX[i + 1] > IMAGE_RIGHT) {
          nodeX[i + 1] = IMAGE_RIGHT;
        }
        for (pixelX = nodeX[Number(i)]; pixelX < nodeX[i + 1]; pixelX++) {
          cb(pixelX, pixelY);
        }
      }
    }
  }
}

export function fill(
  cb: (x: number, y: number) => void,
  check: (x: number, y: number) => Color,
  newColor: Color,
  startX: number,
  startY: number,
  imageWidth: number,
  imageHeight: number
) {
  if (
    startX < 0 ||
    startX >= imageWidth ||
    startY < 0 ||
    startY >= imageHeight
  ) {
    console.warn('Startpunkt außerhalb der Bildgrenzen.');
    return;
  }

  const targetColor = check(startX, startY);

  if (newColor.equals(targetColor)) {
    return;
  }

  const queue: [number, number][] = [];
  queue.push([startX, startY]);

  const visited = new Set<string>();
  visited.add(`${startX},${startY}`);

  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
  ];

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;

    cb(x, y);

    for (const [dx, dy] of directions) {
      const nextX = x + dx;
      const nextY = y + dy;
      const coordKey = `${nextX},${nextY}`;

      if (
        nextX < 0 ||
        nextX >= imageWidth ||
        nextY < 0 ||
        nextY >= imageHeight
      ) {
        continue;
      }

      if (!visited.has(coordKey)) {
        const currentColor = check(nextX, nextY);

        if (currentColor && currentColor.equals(targetColor)) {
          visited.add(coordKey);
          queue.push([nextX, nextY]);
        }
      }
    }
  }
}

export function createAirbrushBrushStamp(
  dimension: IPoint & number,
  color: Color,
  isRound = false,
  numDots = 200,
  maxAlphaFactor = 1.0
) {
  // Sicherstellen, dass Breite und Höhe Integer sind
  // dimension.x = Math.max(1, Math.round(dimension.x));
  // dimension.y = Math.max(1, Math.round(dimension.x));

  const brushStampData = new Uint8ClampedArray(dimension.x * dimension.y * 4);

  for (let i = 3; i < brushStampData.length; i += 4) {
    brushStampData[i] = 0;
  }

  const [brushR, brushG, brushB, brushA] = color.toRGBA();

  const centerX = dimension.x / 2;
  const centerY = dimension.y / 2;
  const effectiveRadius = Math.min(dimension.x, dimension.y) / 2;

  for (let i = 0; i < numDots; i++) {
    let dotX, dotY;

    if (isRound) {
      const angle = Math.random() * 2 * Math.PI;
      const dist = Math.random() * effectiveRadius; // Oder Math.random() * Math.random() * effectiveRadius für dichtere Mitte

      dotX = Math.round(centerX + dist * Math.cos(angle));
      dotY = Math.round(centerY + dist * Math.sin(angle));

      // Optional: Alpha basierend auf Entfernung vom runden Zentrum
      const distanceToCenter = Math.sqrt(
        Math.pow(dotX - centerX, 2) + Math.pow(dotY - centerY, 2)
      );
      const alphaMultiplier = 1 - distanceToCenter / effectiveRadius;
      const dotAlpha = Math.round(brushA * alphaMultiplier * maxAlphaFactor);

      if (dotX < 0 || dotX >= dimension.x || dotY < 0 || dotY >= dimension.y) {
        continue;
      }

      const index = (dotY * dimension.x + dotX) * 4;
      brushStampData[index + 0] = brushR;
      brushStampData[index + 1] = brushG;
      brushStampData[index + 2] = brushB;
      brushStampData[index + 3] = dotAlpha;
    } else {
      dotX = Math.floor(Math.random() * dimension.x);
      dotY = Math.floor(Math.random() * dimension.y);

      const dotAlpha = Math.round(brushA * maxAlphaFactor);

      const index = (dotY * dimension.x + dotX) * 4;

      brushStampData[index + 0] = brushR;
      brushStampData[index + 1] = brushG;
      brushStampData[index + 2] = brushB;
      brushStampData[index + 3] = dotAlpha;
    }
  }

  return brushStampData;
}
