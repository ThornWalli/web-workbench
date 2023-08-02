'use strict';

/**
 * Bresenham-Algorithmus
 */
// eslint-disable-next-line complexity
export function getLinePoints (x0, y0, x1, y1, density = 0) {
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let err = (dx > dy ? dx : -dy) / 2;

  const points = [];
  let i = 0;
  while (true) {
    if (density === 0 || i >= 1) {
      points.push([
        x0, y0
      ]);
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

export function line (cb, x0, y0, x1, y1, { density = 0 }) {
  getLinePoints(x0, y0, x1, y1, density).forEach((point) => {
    cb(point[0], point[1]);
  });
}

export function curve (cb, x1, y1, x2, y2, x3, y3, x4, y4, density = 0.001) {
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
    cb(parseInt(xu), parseInt(yu));
  }
}

// eslint-disable-next-line complexity
export function rectangle (cb, x, y, width, height, { strokeSize = 0, filled = false, density }) {
  if (filled) {
    const cbFilled = (x, y) => {
      return cb(x, y, true);
    };
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
    strokeSize = [
      width < 0 ? -strokeSize : strokeSize, height < 0 ? -strokeSize : strokeSize
    ];
    let last = [
      x - strokeSize[0], y - strokeSize[1]
    ];
    [
      [
        x - strokeSize[0], y - strokeSize[1]
      ],
      [
        x - strokeSize[0], y + height + strokeSize[1]
      ],
      [
        x + width + strokeSize[0], y + height + strokeSize[1]
      ],
      [
        x + width + strokeSize[0], y - strokeSize[1]
      ],
      last
    ].forEach((pos) => {
      line(cb, last[0], last[1], pos[0], pos[1], {
        density
      });
      last = pos;
    });
  }
}

/**
 * Bresenham-Algorithmus
 */
// eslint-disable-next-line complexity
export function ellipse (cb, xc, yc, width, height, { filled = false, density = 0 }) {
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
  const cbFilled = (x, y) => {
    return cb(x, y, true);
  };
  const strokeData = [];

  for (x = 0, y = height, sigma = 2 * b2 + a2 * (1 - 2 * height); b2 * x <= a2 * y; x++) {
    if (!density || i >= 1) {
      strokeData.push([
        xc + x, yc + y
      ]);
      strokeData.push([
        xc - x, yc - y
      ]);
      strokeData.push([
        xc - x, yc + y
      ]);
      strokeData.push([
        xc + x, yc - y
      ]);
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
  for (x = width, y = 0, sigma = 2 * a2 + b2 * (1 - 2 * width); a2 * y <= b2 * x; y++) {
    if (!density || i >= 1) {
      strokeData.push([
        xc + x, yc + y
      ]);
      strokeData.push([
        xc - x, yc + y
      ]);
      strokeData.push([
        xc + x, yc - y
      ]);
      strokeData.push([
        xc - x, yc - y
      ]);
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
  strokeData.forEach((stroke) => {
    cb(stroke[0], stroke[1]);
  });
}

// bool pointInPolygon() {
//
//   bool oddNodes=NO, current=polY[polyCorners-1]>y, previous;
//   for (int i=0; i<polyCorners; i++) {
//     previous=current; current=polyY[Number(i)]>y; if (current!=previous) oddNodes^=y*multiple[i]+constant[i]<x; }
//   return oddNodes; }

// eslint-disable-next-line complexity
export function polygon (cb, nodes, closed, { strokeSize = 0, filled = false, density = 0 }) {
  let lastAnchor;
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;
  let maxX = Number.MIN_VALUE;
  let maxY = Number.MIN_VALUE;
  nodes.forEach((node) => {
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
        density
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
        density
      });
    }
  }
  if (filled) {
    const cbFilled = (x, y) => {
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

// eslint-disable-next-line complexity
export function fillPolygon (cb, polygons, { IMAGE_LEFT = 0, IMAGE_TOP = 0, IMAGE_RIGHT, IMAGE_BOTTOM }) {
  const polyY = [];
  const polyX = [];
  polygons.forEach((polygon) => {
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
          polyX[Number(i)] + ((pixelY - polyY[Number(i)]) / (polyY[Number(j)] - polyY[Number(i)])) * (polyX[Number(j)] - polyX[Number(i)])
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
