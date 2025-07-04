// import type Color from '../classes/Color';

// export function ellipse(
//   cb: (x: number, y: number, filled: boolean) => void,
//   xc: number,
//   yc: number,
//   width: number,
//   height: number,
//   { strokeSize = 0, style = SHAPE_STYLE.STROKED, density = 0 }
// ) {
//   if (width < 0) {
//     width = Math.abs(width);
//   }
//   if (height < 0) {
//     height = Math.abs(height);
//   }

//   const cbFilled = (x: number, y: number) => {
//     return cb(x, y, true);
//   };

//   if (style === SHAPE_STYLE.FILLED || style === SHAPE_STYLE.STROKED_FILLED) {
//     const pointDensity = Math.max(1, Math.round(density)); // pointDensity muss mindestens 1 sein
//     width = Math.round(width);
//     height = Math.round(height);

//     const a2 = width * width;
//     const b2 = height * height;
//     const fa2 = 4 * a2;
//     const fb2 = 4 * b2;
//     let x;
//     let y;
//     let sigma;
//     const fillPoints = [];

//     for (
//       x = 0, y = height, sigma = 2 * b2 + a2 * (1 - 2 * height);
//       b2 * x <= a2 * y;
//       x++
//     ) {
//       const currentY_pos = yc + y;
//       const currentY_neg = yc - y;

//       for (
//         let currentX = xc - x;
//         currentX <= xc + x;
//         currentX += pointDensity
//       ) {
//         fillPoints.push([currentX, currentY_pos]);
//         if (y !== 0) {
//           fillPoints.push([currentX, currentY_neg]);
//         }
//       }

//       if (sigma >= 0) {
//         sigma += fa2 * (1 - y);
//         y--;
//       }
//       sigma += b2 * (4 * x + 6);
//     }

//     for (
//       x = width, y = 0, sigma = 2 * a2 + b2 * (1 - 2 * width);
//       a2 * y <= b2 * x;
//       y++
//     ) {
//       const currentY_pos = yc + y;
//       const currentY_neg = yc - y;

//       for (
//         let currentX = xc - x;
//         currentX <= xc + x;
//         currentX += pointDensity
//       ) {
//         fillPoints.push([currentX, currentY_pos]);
//         if (y !== 0) {
//           fillPoints.push([currentX, currentY_neg]);
//         }
//       }

//       if (sigma >= 0) {
//         sigma += fb2 * (1 - x);
//         x--;
//       }
//       sigma += a2 * (4 * y + 6);
//     }

//     fillPoints.forEach(fill => {
//       cbFilled(fill[0], fill[1]);
//     });
//   }

//   if (
//     (style === SHAPE_STYLE.STROKED || style === SHAPE_STYLE.STROKED_FILLED) &&
//     strokeSize > 0
//   ) {
//     const a2 = width * width;
//     const b2 = height * height;
//     const fa2 = 4 * a2;
//     const fb2 = 4 * b2;
//     let x;
//     let y;
//     let sigma;
//     let i = 0;
//     const strokeData = [];

//     for (
//       x = 0, y = height, sigma = 2 * b2 + a2 * (1 - 2 * height);
//       b2 * x <= a2 * y;
//       x++
//     ) {
//       if (!density || i >= 1) {
//         strokeData.push([xc + x, yc + y]);
//         strokeData.push([xc - x, yc - y]);
//         strokeData.push([xc - x, yc + y]);
//         strokeData.push([xc + x, yc - y]);
//         i = 0;
//       } else {
//         i += 1 / density;
//       }
//       if (sigma >= 0) {
//         sigma += fa2 * (1 - y);
//         y--;
//       }
//       sigma += b2 * (4 * x + 6);
//     }
//     i = 0;
//     for (
//       x = width, y = 0, sigma = 2 * a2 + b2 * (1 - 2 * width);
//       a2 * y <= b2 * x;
//       y++
//     ) {
//       if (!density || i >= 1) {
//         strokeData.push([xc + x, yc + y]);
//         strokeData.push([xc - x, yc + y]);
//         strokeData.push([xc + x, yc - y]);
//         strokeData.push([xc - x, yc - y]);
//         i = 0;
//       } else {
//         i += 1 / density;
//       }
//       if (sigma >= 0) {
//         sigma += fb2 * (1 - x);
//         x--;
//       }
//       sigma += a2 * (4 * y + 6);
//     }
//     strokeData.forEach(stroke => {
//       cb(stroke[0], stroke[1], false);
//     });
//   }
// }

// export function ellipse(
//   cb: (
//     x: number,
//     y: number,
//     { stroked, filled }: { stroked?: boolean; filled?: boolean }
//   ) => void,
//   centerX: number,
//   centerY: number,
//   width: number,
//   height: number,
//   {
//     strokeSize = 0,
//     style = SHAPE_STYLE.STROKED,
//     segmentLength,
//     gapLength,
//     interpolateSegments = true
//   }: {
//     strokeSize?: number;
//     style?: SHAPE_STYLE;
//     segmentLength: number;
//     gapLength: number;
//     interpolateSegments?: boolean;
//   }
// ) {
//   if (width < 0) {
//     width = Math.abs(width);
//   }
//   if (height < 0) {
//     height = Math.abs(height);
//   }

//   // --- Füll-Logik (unverändert) ---
//   if (style === SHAPE_STYLE.FILLED || style === SHAPE_STYLE.STROKED_FILLED) {
//     const a2_fill = width * width;
//     const b2_fill = height * height;
//     const fa2_fill = 4 * a2_fill;
//     const fb2_fill = 4 * b2_fill;
//     let x_fill;
//     let y_fill;
//     let sigma_fill;

//     for (
//       x_fill = 0,
//         y_fill = height,
//         sigma_fill = 2 * b2_fill + a2_fill * (1 - 2 * height);
//       b2_fill * x_fill <= a2_fill * y_fill;
//       x_fill++
//     ) {
//       const currentY_pos = centerY + y_fill;
//       const currentY_neg = centerY - y_fill;

//       for (
//         let currentX = centerX - x_fill;
//         currentX <= centerX + x_fill;
//         currentX++
//       ) {
//         cb(currentX, currentY_pos, { filled: true });
//         if (y_fill !== 0) {
//           cb(currentX, currentY_neg, { filled: true });
//         }
//       }

//       if (sigma_fill >= 0) {
//         sigma_fill += fa2_fill * (1 - y_fill);
//         y_fill--;
//       }
//       sigma_fill += b2_fill * (4 * x_fill + 6);
//     }

//     for (
//       x_fill = width,
//         y_fill = 0,
//         sigma_fill = 2 * a2_fill + b2_fill * (1 - 2 * width);
//       a2_fill * y_fill <= b2_fill * x_fill;
//       y_fill++
//     ) {
//       const currentY_pos = centerY + y_fill;
//       const currentY_neg = centerY - y_fill;

//       for (
//         let currentX = centerX - x_fill;
//         currentX <= centerX + x_fill;
//         currentX++
//       ) {
//         cb(currentX, currentY_pos, { filled: true });
//         if (y_fill !== 0) {
//           cb(currentX, currentY_neg, { filled: true });
//         }
//       }

//       if (sigma_fill >= 0) {
//         sigma_fill += fb2_fill * (1 - x_fill);
//         x_fill--;
//       }
//       sigma_fill += a2_fill * (4 * y_fill + 6);
//     }
//   }

//   if (
//     (style === SHAPE_STYLE.STROKED || style === SHAPE_STYLE.STROKED_FILLED) &&
//     strokeSize > 0
//   ) {
//     const effectiveSegmentLength = Math.max(0, segmentLength);
//     const effectiveGapLength = Math.max(0, gapLength);

//     if (effectiveSegmentLength === 0 && effectiveGapLength === 0) {
//       const a2 = width * width;
//       const b2 = height * height;
//       const fa2 = 4 * a2;
//       const fb2 = 4 * b2;
//       let x;
//       let y;
//       let sigma;

//       for (
//         x = 0, y = height, sigma = 2 * b2 + a2 * (1 - 2 * height);
//         b2 * x <= a2 * y;
//         x++
//       ) {
//         cb(centerX + x, centerY + y, { stroked: true });
//         cb(centerX - x, centerY + y, { stroked: true });
//         cb(centerX + x, centerY - y, { stroked: true });
//         cb(centerX - x, centerY - y, { stroked: true });
//         if (sigma >= 0) {
//           sigma += fa2 * (1 - y);
//           y--;
//         }
//         sigma += b2 * (4 * x + 6);
//       }
//       for (
//         x = width, y = 0, sigma = 2 * a2 + b2 * (1 - 2 * width);
//         a2 * y <= b2 * x;
//         y++
//       ) {
//         cb(centerX + x, centerY + y, { stroked: true });
//         cb(centerX - x, centerY + y, { stroked: true });
//         cb(centerX + x, centerY - y, { stroked: true });
//         cb(centerX - x, centerY - y, { stroked: true });
//         if (sigma >= 0) {
//           sigma += fb2 * (1 - x);
//           x--;
//         }
//         sigma += a2 * (4 * y + 6);
//       }
//       return;
//     }

//     let currentAccumulatedDistance = 0;
//     let drawing = true;

//     let lineStartX: number;
//     let lineStartY: number;

//     const rawEllipsePoints: { x: number; y: number }[] = [];
//     const a2 = width * width;
//     const b2 = height * height;
//     const fa2 = 4 * a2;
//     const fb2 = 4 * b2;
//     let mx, my, msigma;

//     for (
//       mx = 0, my = height, msigma = 2 * b2 + a2 * (1 - 2 * height);
//       b2 * mx <= a2 * my;
//       mx++
//     ) {
//       rawEllipsePoints.push({ x: centerX + mx, y: centerY + my });
//       if (my !== 0) rawEllipsePoints.push({ x: centerX + mx, y: centerY - my });
//       if (mx !== 0) rawEllipsePoints.push({ x: centerX - mx, y: centerY + my });
//       if (mx !== 0 && my !== 0)
//         rawEllipsePoints.push({ x: centerX - mx, y: centerY - my });

//       if (msigma >= 0) {
//         msigma += fa2 * (1 - my);
//         my--;
//       }
//       msigma += b2 * (4 * mx + 6);
//     }

//     for (
//       mx = width, my = 0, msigma = 2 * a2 + b2 * (1 - 2 * width);
//       a2 * my <= b2 * mx;
//       my++
//     ) {
//       rawEllipsePoints.push({ x: centerX + mx, y: centerY + my });
//       if (my !== 0) rawEllipsePoints.push({ x: centerX + mx, y: centerY - my });
//       if (mx !== 0) rawEllipsePoints.push({ x: centerX - mx, y: centerY + my });
//       if (mx !== 0 && my !== 0)
//         rawEllipsePoints.push({ x: centerX - mx, y: centerY - my });

//       if (msigma >= 0) {
//         msigma += fb2 * (1 - mx);
//         mx--;
//       }
//       msigma += a2 * (4 * my + 6);
//     }

//     const uniquePointsMap = new Map<string, { x: number; y: number }>();
//     rawEllipsePoints.forEach(p => {
//       const key = `${Math.round(p.x)},${Math.round(p.y)}`;
//       if (!uniquePointsMap.has(key)) {
//         uniquePointsMap.set(key, p);
//       }
//     });

//     const finalPoints = Array.from(uniquePointsMap.values()).sort((a, b) => {
//       const angleA = Math.atan2(a.y - centerY, a.x - centerX);
//       const angleB = Math.atan2(b.y - centerY, b.x - centerX);
//       return angleA - angleB;
//     });

//     if (finalPoints.length > 0) {
//       finalPoints.push(finalPoints[0]);
//     }

//     let prevXInLoop = finalPoints.length > 0 ? finalPoints[0].x : centerX;
//     let prevYInLoop = finalPoints.length > 0 ? finalPoints[0].y : centerY;

//     if (finalPoints.length > 0) {
//       lineStartX = finalPoints[0].x;
//       lineStartY = finalPoints[0].y;

//       if (effectiveSegmentLength > 0 && !interpolateSegments) {
//         cb(lineStartX, lineStartY, { stroked: true });
//       }
//     } else {
//       return;
//     }

//     for (let i = 1; i < finalPoints.length; i++) {
//       const currentX = finalPoints[i].x;
//       const currentY = finalPoints[i].y;

//       const stepLength = Math.sqrt(
//         Math.pow(currentX - prevXInLoop, 2) +
//           Math.pow(currentY - prevYInLoop, 2)
//       );

//       if (stepLength < 0.0001) {
//         prevXInLoop = currentX;
//         prevYInLoop = currentY;
//         continue;
//       }

//       currentAccumulatedDistance += stepLength;

//       if (drawing) {
//         if (effectiveSegmentLength === 0) {
//           drawing = false;
//           currentAccumulatedDistance = 0;
//           lineStartX = currentX;
//           lineStartY = currentY;
//           prevXInLoop = currentX;
//           prevYInLoop = currentY;
//           continue;
//         }

//         if (currentAccumulatedDistance >= effectiveSegmentLength) {
//           const overshoot = currentAccumulatedDistance - effectiveSegmentLength;
//           const interpolationFactor = (stepLength - overshoot) / stepLength;

//           const segmentEndPointX =
//             prevXInLoop + (currentX - prevXInLoop) * interpolationFactor;
//           const segmentEndPointY =
//             prevYInLoop + (currentY - prevYInLoop) * interpolationFactor;

//           if (interpolateSegments) {
//             drawLineInUint8ClArray(
//               lineStartX,
//               lineStartY,
//               segmentEndPointX,
//               segmentEndPointY,
//               (x: number, y: number) => cb(x, y, { stroked: true })
//             );
//           } else {
//             cb(segmentEndPointX, segmentEndPointY, { stroked: true });
//           }

//           drawing = false;
//           currentAccumulatedDistance = overshoot;
//           lineStartX = segmentEndPointX;
//           lineStartY = segmentEndPointY;
//         } else {
//           if (!interpolateSegments) {
//             cb(currentX, currentY, { stroked: true });
//           }
//         }
//       } else {
//         if (effectiveGapLength === 0) {
//           drawing = true;
//           currentAccumulatedDistance = 0;
//           lineStartX = currentX;
//           lineStartY = currentY;
//           prevXInLoop = currentX;
//           prevYInLoop = currentY;
//           continue;
//         }

//         if (currentAccumulatedDistance >= effectiveGapLength) {
//           const overshoot = currentAccumulatedDistance - effectiveGapLength;
//           const interpolationFactor = (stepLength - overshoot) / stepLength;

//           drawing = true;
//           currentAccumulatedDistance = overshoot;

//           const segmentStartX =
//             prevXInLoop + (currentX - prevXInLoop) * interpolationFactor;
//           const segmentStartY =
//             prevYInLoop + (currentY - prevYInLoop) * interpolationFactor;
//           lineStartX = segmentStartX;
//           lineStartY = segmentStartY;

//           if (!interpolateSegments && effectiveSegmentLength > 0) {
//             cb(lineStartX, lineStartY, { stroked: true });
//           }
//         }
//       }

//       prevXInLoop = currentX;
//       prevYInLoop = currentY;
//     }

//     if (
//       drawing &&
//       effectiveSegmentLength > 0 &&
//       currentAccumulatedDistance > 0.001
//     ) {
//       if (interpolateSegments) {
//         drawLineInUint8ClArray(
//           lineStartX,
//           lineStartY,
//           finalPoints[0].x,
//           finalPoints[0].y,
//           (x: number, y: number) => cb(x, y, { stroked: true })
//         );
//       }
//     }
//   }
// }
// export function rectangle(
//   cb: (
//     x: number,
//     y: number,
//     { filled, stroked }: { filled?: boolean; stroked?: boolean },
//     width?: number,
//     height?: number
//   ) => void,
//   x: number,
//   y: number,
//   width: number,
//   height: number,
//   {
//     strokeSize = 0,
//     strokeAlign = STROKE_ALIGN.CENTER,
//     style = SHAPE_STYLE.STROKED,
//     segmentLength,
//     gapLength
//   }: {
//     strokeAlign?: STROKE_ALIGN;
//     strokeSize?: number;
//     style?: SHAPE_STYLE;
//     segmentLength: number;
//     gapLength: number;
//   }
// ) {
//   if (strokeSize !== 1) {
//     strokeSize = Math.floor(strokeSize / 2);
//   }

//   const dimension = ipoint(() => Math.abs(ipoint(width, height)));

//   if (style == SHAPE_STYLE.FILLED || style == SHAPE_STYLE.STROKED_FILLED) {
//     cb(x, y, { filled: true }, dimension.x, dimension.y);
//   }

//   if (
//     (style == SHAPE_STYLE.STROKED || style == SHAPE_STYLE.STROKED_FILLED) &&
//     strokeSize > 0
//   ) {
//     let strokeSizeDimension;
//     switch (strokeAlign) {
//       case STROKE_ALIGN.INSIDE:
//         strokeSizeDimension = ipoint(
//           width < 0 ? strokeSize : -strokeSize,
//           height < 0 ? strokeSize : -strokeSize
//         );
//         break;
//       case STROKE_ALIGN.OUTSIDE:
//         strokeSizeDimension = ipoint(
//           width < 0 ? -strokeSize : strokeSize,
//           height < 0 ? -strokeSize : strokeSize
//         );
//         break;
//       case STROKE_ALIGN.CENTER:
//       default:
//         strokeSizeDimension = ipoint(0, 0);
//         break;
//     }

//     if (dimension.x > 0 && dimension.y > 0) {
//       let last = [x - strokeSizeDimension.x, y - strokeSizeDimension.y];

//       [
//         [x - strokeSizeDimension.x, y - strokeSizeDimension.y],
//         [x - strokeSizeDimension.x, y + dimension.y + strokeSizeDimension.y],
//         [
//           x + dimension.x + strokeSizeDimension.x,
//           y + dimension.y + strokeSizeDimension.y
//         ],
//         [x + dimension.x + strokeSizeDimension.x, y - strokeSizeDimension.y],
//         last
//       ].forEach(pos => {
//         line(
//           (x: number, y: number) => cb(x, y, { stroked: true }),
//           last[0],
//           last[1],
//           pos[0],
//           pos[1],
//           {
//             segmentLength,
//             gapLength
//           }
//         );
//         last = pos;
//       });
//     }
//   }
// }

// export function basicLine(
//   cb: (x: number, y: number) => void,
//   x0: number,
//   y0: number,
//   x1: number,
//   y1: number,
//   options?: { gapLength?: number }
// ) {
//   getLinePoints(x0, y0, x1, y1, options?.gapLength).forEach(point => {
//     cb(point[0], point[1]);
//   });
// }

// function drawLineInUint8ClArray(
//   x0: number,
//   y0: number,
//   x1: number,
//   y1: number,
//   drawPixelOrBrush: CallableFunction
// ) {
//   x0 = Math.round(x0);
//   y0 = Math.round(y0);
//   x1 = Math.round(x1);
//   y1 = Math.round(y1);

//   const dx = Math.abs(x1 - x0);
//   const dy = Math.abs(y1 - y0);
//   const sx = x0 < x1 ? 1 : -1;
//   const sy = y0 < y1 ? 1 : -1;
//   let err = dx - dy;

//   while (true) {
//     drawPixelOrBrush(x0, y0);

//     if (x0 === x1 && y0 === y1) break;
//     const e2 = 2 * err;
//     if (e2 > -dy) {
//       err -= dy;
//       x0 += sx;
//     }
//     if (e2 < dx) {
//       err += dx;
//       y0 += sy;
//     }
//   }
// }

// export function curve(
//   cb: CallableFunction,
//   x1: number,
//   y1: number,
//   x2: number,
//   y2: number,
//   x3: number,
//   y3: number,
//   x4: number,
//   y4: number,
//   {
//     segmentLength,
//     gapLength,
//     interpolateSegments = true
//   }: {
//     segmentLength: number;
//     gapLength: number;
//     interpolateSegments?: boolean;
//   }
// ) {
//   const effectiveSegmentLength = Math.max(0, segmentLength);
//   const effectiveGapLength = Math.max(0, gapLength);

//   if (effectiveSegmentLength === 0 && effectiveGapLength === 0) {
//     cb(x1, y1);
//     return;
//   }

//   let prevCurveX = x1;
//   let prevCurveY = y1;
//   let currentAccumulatedDistance = 0;
//   let drawing = true;

//   let lineStartX = x1;
//   let lineStartY = y1;

//   if (effectiveSegmentLength > 0 && !interpolateSegments) {
//     cb(x1, y1);
//   }

//   const stepSize = 0.001;
//   let u = stepSize;

//   while (u <= 1.0) {
//     const xu =
//       (1 - u) ** 3 * x1 +
//       3 * u * (1 - u) ** 2 * x2 +
//       3 * u ** 2 * (1 - u) * x3 +
//       u ** 3 * x4;
//     const yu =
//       (1 - u) ** 3 * y1 +
//       3 * u * (1 - u) ** 2 * y2 +
//       3 * u ** 2 * (1 - u) * y3 +
//       u ** 3 * y4;

//     const distanceOfStep = Math.sqrt(
//       Math.pow(xu - prevCurveX, 2) + Math.pow(yu - prevCurveY, 2)
//     );

//     if (distanceOfStep < 0.0001 && u < 1.0) {
//       prevCurveX = xu;
//       prevCurveY = yu;
//       u += stepSize;
//       continue;
//     }

//     currentAccumulatedDistance += distanceOfStep;

//     if (drawing) {
//       if (effectiveSegmentLength === 0) {
//         drawing = false;
//         currentAccumulatedDistance = 0;
//         lineStartX = xu;
//         lineStartY = yu;
//         prevCurveX = xu;
//         prevCurveY = yu;
//         u += stepSize;
//         continue;
//       }

//       if (currentAccumulatedDistance >= effectiveSegmentLength) {
//         const overshoot = currentAccumulatedDistance - effectiveSegmentLength;
//         const interpolationFactor =
//           (distanceOfStep - overshoot) / distanceOfStep;

//         const segmentEndPointX =
//           prevCurveX + (xu - prevCurveX) * interpolationFactor;
//         const segmentEndPointY =
//           prevCurveY + (yu - prevCurveY) * interpolationFactor;

//         if (interpolateSegments) {
//           drawLineInUint8ClArray(
//             lineStartX,
//             lineStartY,
//             segmentEndPointX,
//             segmentEndPointY,
//             cb
//           );
//         } else {
//           cb(segmentEndPointX, segmentEndPointY);
//         }

//         drawing = false;
//         currentAccumulatedDistance = overshoot;
//         lineStartX = segmentEndPointX;
//         lineStartY = segmentEndPointY;
//       } else {
//         if (!interpolateSegments) {
//           cb(xu, yu);
//         }
//       }
//     } else {
//       if (effectiveGapLength === 0) {
//         drawing = true;
//         currentAccumulatedDistance = 0;
//         lineStartX = xu;
//         lineStartY = yu;
//         prevCurveX = xu;
//         prevCurveY = yu;
//         u += stepSize;
//         continue;
//       }

//       if (currentAccumulatedDistance >= effectiveGapLength) {
//         const overshoot = currentAccumulatedDistance - effectiveGapLength;
//         drawing = true;
//         currentAccumulatedDistance = overshoot;

//         const segmentStartX =
//           prevCurveX +
//           (xu - prevCurveX) * ((distanceOfStep - overshoot) / distanceOfStep);
//         const segmentStartY =
//           prevCurveY +
//           (yu - prevCurveY) * ((distanceOfStep - overshoot) / distanceOfStep);
//         lineStartX = segmentStartX;
//         lineStartY = segmentStartY;

//         if (!interpolateSegments && effectiveSegmentLength > 0) {
//           cb(lineStartX, lineStartY);
//         }
//       }
//     }

//     prevCurveX = xu;
//     prevCurveY = yu;
//     u += stepSize;
//   }

//   if (drawing && effectiveSegmentLength > 0) {
//     if (interpolateSegments) {
//       drawLineInUint8ClArray(
//         lineStartX,
//         lineStartY,
//         prevCurveX,
//         prevCurveY,
//         cb
//       );
//     }
//   }
// }

// export function line(
//   cb: (x: number, y: number) => void,
//   startX: number,
//   startY: number,
//   endX: number,
//   endY: number,
//   {
//     segmentLength = 1,
//     gapLength = 0
//   }: {
//     segmentLength?: number;
//     gapLength?: number;
//   } = {}
// ) {
//   startX = Math.round(startX);
//   startY = Math.round(startY);
//   endX = Math.round(endX);
//   endY = Math.round(endY);

//   const dx = Math.abs(endX - startX);
//   const dy = Math.abs(endY - startY);
//   const sx = startX < endX ? 1 : -1;
//   const sy = startY < endY ? 1 : -1;

//   let err = dx - dy;

//   const effectiveSegmentLength = Math.max(0, segmentLength);
//   const effectiveGapLength = Math.max(0, gapLength);
//   const patternLength = effectiveSegmentLength + effectiveGapLength;

//   let pixelsDrawnInPattern = 0;

//   while (true) {
//     if (effectiveSegmentLength === 0 && effectiveGapLength === 0) {
//       cb(startX, startY);
//       break;
//     }

//     const inSegment = pixelsDrawnInPattern < effectiveSegmentLength;

//     if (inSegment) {
//       cb(startX, startY);
//     }

//     pixelsDrawnInPattern++;

//     if (patternLength > 0 && pixelsDrawnInPattern >= patternLength) {
//       pixelsDrawnInPattern = 0;
//     }

//     if (startX === endX && startY === endY) {
//       break;
//     }

//     const e2 = 2 * err;

//     if (e2 > -dy) {
//       err -= dy;
//       startX += sx;
//     }
//     if (e2 < dx) {
//       err += dx;
//       startY += sy;
//     }
//   }
// }

// export function drawDots(size: IPoint & number, color: Color) {
//   const data = drawCircle(size, color);
//   for (let i = 0; i < data.length; i += 4) {
//     if (!(data[i + 3] > 0 && Math.random() < 0.25 / ((size.x + size.y) / 2))) {
//       data[i] = 0;
//       data[i + 1] = 0;
//       data[i + 2] = 0;
//       data[i + 3] = 0;
//     }
//   }
//   return data;
// }

// export function drawCircle(
//   size: IPoint & number,
//   color: Color,
//   {
//     style
//   }: {
//     style: SHAPE_STYLE;
//   } = { style: SHAPE_STYLE.FILLED }
// ) {
//   if (size.x === 1 && size.y === 1) {
//     return new Uint8ClampedArray([color.r, color.g, color.b, color.a]);
//   }

//   const realSize = ipoint(() => size - 1);
//   const data = new Uint8ClampedArray(Array(size.x * size.y * 4).fill(0));

//   ellipse(
//     (x: number, y: number) => {
//       const index = (Math.round(y) * size.x + Math.round(x)) * 4;
//       data[index] = color.r; // R
//       data[index + 1] = color.g; // G
//       data[index + 2] = color.b; // B
//       data[index + 3] = color.a; // A
//     },
//     realSize.x / 2,
//     realSize.y / 2,
//     realSize.x / 2,
//     realSize.y / 2,
//     {
//       style,
//       strokeSize: 0,
//       segmentLength: 1,
//       gapLength: 0
//     }
//   );
//   return data;
// }

// export function drawRectangle(
//   size: IPoint & number,
//   color: Color,
//   {
//     style
//   }: {
//     style: SHAPE_STYLE;
//   } = { style: SHAPE_STYLE.FILLED }
// ) {
//   const data = new Uint8ClampedArray(Array(size.x * size.y * 4).fill(0));

//   rectangle(
//     (x, y, filled, width, height) => {
//       for (let y = 0; y < height!; y++) {
//         const index = Math.round(y) * width! * 4;
//         data.set(
//           new Uint8ClampedArray(Array(width).fill(color.toRGBA()).flat()),
//           index
//         );
//       }
//     },
//     0,
//     0,
//     size.x,
//     size.y,
//     {
//       style,
//       segmentLength: 1,
//       gapLength: 0
//     }
//   );
//   return data;
// }

// export function polygon(
//   cb: (
//     x: number,
//     y: number,
//     { filled, stroked }: { filled?: boolean; stroked?: boolean }
//   ) => void,
//   nodes: { x: number; y: number }[],
//   closed: boolean,
//   options: {
//     style?: SHAPE_STYLE;
//     segmentLength?: number;
//     gapLength?: number;
//   } = { style: SHAPE_STYLE.STROKED }
// ) {
//   let lastAnchor: (typeof nodes)[number] | undefined;
//   let minX = Number.MAX_VALUE;
//   let minY = Number.MAX_VALUE;
//   let maxX = Number.MIN_VALUE;
//   let maxY = Number.MIN_VALUE;

//   if (
//     options.style === SHAPE_STYLE.STROKED ||
//     options.style === SHAPE_STYLE.STROKED_FILLED
//   ) {
//     nodes.forEach(node => {
//       if (lastAnchor) {
//         if (node.x > maxX) {
//           maxX = node.x;
//         }
//         if (node.y > maxY) {
//           maxY = node.y;
//         }
//         if (node.x < minX) {
//           minX = node.x;
//         }
//         if (node.y < minY) {
//           minY = node.y;
//         }
//         line(
//           (x: number, y: number) => cb(x, y, { stroked: true }),
//           lastAnchor.x,
//           lastAnchor.y,
//           node.x,
//           node.y,
//           {
//             segmentLength: options.segmentLength ?? 1,
//             gapLength: options.gapLength ?? 0
//           }
//         );
//       }
//       lastAnchor = node;
//     });
//     if (closed) {
//       const firstNode = nodes[0];
//       if (lastAnchor) {
//         if (firstNode.x > maxX) {
//           maxX = firstNode.x;
//         }
//         if (firstNode.y > maxY) {
//           maxY = firstNode.y;
//         }
//         if (firstNode.x < minX) {
//           minX = firstNode.x;
//         }
//         if (firstNode.y < minY) {
//           minY = firstNode.y;
//         }
//         line(
//           (x: number, y: number) => cb(x, y, { stroked: true }),
//           lastAnchor.x,
//           lastAnchor.y,
//           firstNode.x,
//           firstNode.y,
//           {
//             segmentLength: options.segmentLength ?? 1,
//             gapLength: options.gapLength ?? 0
//           }
//         );
//       }
//     }
//   }
//   if (
//     options.style === SHAPE_STYLE.FILLED ||
//     options.style === SHAPE_STYLE.STROKED_FILLED
//   ) {
//     const cbFilled = (x: number, y: number) => {
//       return cb(x, y, { filled: true });
//     };
//     fillPolygon(cbFilled, nodes, {
//       IMAGE_LEFT: minX,
//       IMAGE_TOP: minY,
//       IMAGE_RIGHT: maxX,
//       IMAGE_BOTTOM: maxY
//     });
//   }
// }

// export function fillPolygon(
//   cb: (x: number, y: number) => void,
//   polygons: { x: number; y: number }[],
//   {
//     IMAGE_LEFT = 0,
//     IMAGE_TOP = 0,
//     IMAGE_RIGHT,
//     IMAGE_BOTTOM
//   }: {
//     IMAGE_LEFT?: number;
//     IMAGE_TOP?: number;
//     IMAGE_RIGHT: number;
//     IMAGE_BOTTOM: number;
//   }
// ) {
//   const polyY: number[] = [];
//   const polyX: number[] = [];
//   polygons.forEach(polygon => {
//     polyY.push(polygon.y);
//     polyX.push(polygon.x);
//   });

//   let nodes;
//   const nodeX = Array(polygons.length);
//   let pixelX;
//   let pixelY;
//   let i;
//   let j;
//   let swap;

//   for (pixelY = IMAGE_TOP; pixelY < IMAGE_BOTTOM; pixelY++) {
//     nodes = 0;
//     j = polygons.length - 1;
//     for (i = 0; i < polygons.length; i++) {
//       if (
//         (polyY[Number(i)] < pixelY && polyY[Number(j)] >= pixelY) ||
//         (polyY[Number(j)] < pixelY && polyY[Number(i)] >= pixelY)
//       ) {
//         nodeX[nodes++] = Math.round(
//           polyX[Number(i)] +
//             ((pixelY - polyY[Number(i)]) /
//               (polyY[Number(j)] - polyY[Number(i)])) *
//               (polyX[Number(j)] - polyX[Number(i)])
//         );
//       }
//       j = i;
//     }

//     i = 0;
//     while (i < nodes - 1) {
//       if (nodeX[Number(i)] > nodeX[i + 1]) {
//         swap = nodeX[Number(i)];
//         nodeX[Number(i)] = nodeX[i + 1];
//         nodeX[i + 1] = swap;
//         if (i) {
//           i--;
//         }
//       } else {
//         i++;
//       }
//     }

//     for (i = 0; i < nodes; i += 2) {
//       if (nodeX[Number(i)] >= IMAGE_RIGHT) {
//         break;
//       }
//       if (nodeX[i + 1] > IMAGE_LEFT) {
//         if (nodeX[Number(i)] < IMAGE_LEFT) {
//           nodeX[Number(i)] = IMAGE_LEFT;
//         }
//         if (nodeX[i + 1] > IMAGE_RIGHT) {
//           nodeX[i + 1] = IMAGE_RIGHT;
//         }
//         for (pixelX = nodeX[Number(i)]; pixelX < nodeX[i + 1]; pixelX++) {
//           cb(pixelX, pixelY);
//         }
//       }
//     }
//   }
// }

// export function fill(
//   cb: (x: number, y: number) => void,
//   check: (x: number, y: number) => Color,
//   newColor: Color,
//   startX: number,
//   startY: number,
//   imageWidth: number,
//   imageHeight: number
// ) {
//   if (
//     startX < 0 ||
//     startX >= imageWidth ||
//     startY < 0 ||
//     startY >= imageHeight
//   ) {
//     console.warn('Startpunkt außerhalb der Bildgrenzen.');
//     return;
//   }

//   const targetColor = check(startX, startY);

//   if (newColor.equals(targetColor)) {
//     return;
//   }

//   const queue: [number, number][] = [];
//   queue.push([startX, startY]);

//   const visited = new Set<string>();
//   visited.add(`${startX},${startY}`);

//   const directions = [
//     [0, 1],
//     [0, -1],
//     [1, 0],
//     [-1, 0]
//   ];

//   while (queue.length > 0) {
//     const [x, y] = queue.shift()!;

//     cb(x, y);

//     for (const [dx, dy] of directions) {
//       const nextX = x + dx;
//       const nextY = y + dy;
//       const coordKey = `${nextX},${nextY}`;

//       if (
//         nextX < 0 ||
//         nextX >= imageWidth ||
//         nextY < 0 ||
//         nextY >= imageHeight
//       ) {
//         continue;
//       }

//       if (!visited.has(coordKey)) {
//         const currentColor = check(nextX, nextY);

//         if (currentColor && currentColor.equals(targetColor)) {
//           visited.add(coordKey);
//           queue.push([nextX, nextY]);
//         }
//       }
//     }
//   }
// }

// export function createAirbrushBrushStamp(
//   dimension: IPoint & number,
//   color: Color,
//   isRound = false,
//   numDots = 200,
//   maxAlphaFactor = 1.0
// ) {
//   const brushStampData = new Uint8ClampedArray(dimension.x * dimension.y * 4);

//   for (let i = 3; i < brushStampData.length; i += 4) {
//     brushStampData[i] = 0;
//   }

//   const [brushR, brushG, brushB, brushA] = color.toRGBA();

//   const centerX = dimension.x / 2;
//   const centerY = dimension.y / 2;
//   const effectiveRadius = Math.min(dimension.x, dimension.y) / 2;

//   for (let i = 0; i < numDots; i++) {
//     let dotX, dotY;

//     if (isRound) {
//       const angle = Math.random() * 2 * Math.PI;
//       const dist = Math.random() * effectiveRadius;

//       dotX = Math.round(centerX + dist * Math.cos(angle));
//       dotY = Math.round(centerY + dist * Math.sin(angle));

//       const distanceToCenter = Math.sqrt(
//         Math.pow(dotX - centerX, 2) + Math.pow(dotY - centerY, 2)
//       );
//       const alphaMultiplier = 1 - distanceToCenter / effectiveRadius;
//       const dotAlpha = Math.round(brushA * alphaMultiplier * maxAlphaFactor);

//       if (dotX < 0 || dotX >= dimension.x || dotY < 0 || dotY >= dimension.y) {
//         continue;
//       }

//       const index = (dotY * dimension.x + dotX) * 4;
//       brushStampData[index + 0] = brushR;
//       brushStampData[index + 1] = brushG;
//       brushStampData[index + 2] = brushB;
//       brushStampData[index + 3] = dotAlpha;
//     } else {
//       dotX = Math.floor(Math.random() * dimension.x);
//       dotY = Math.floor(Math.random() * dimension.y);

//       const dotAlpha = Math.round(brushA * maxAlphaFactor);

//       const index = (dotY * dimension.x + dotX) * 4;

//       brushStampData[index + 0] = brushR;
//       brushStampData[index + 1] = brushG;
//       brushStampData[index + 2] = brushB;
//       brushStampData[index + 3] = dotAlpha;
//     }
//   }

//   return brushStampData;
// }

// export function createAirbrushBrushStamp(
//   dimension: IPoint | number,
//   color: Color,
//   isRound = false,
//   numDots = 200,
//   maxAlphaFactor = 1.0
// ): Uint8ClampedArray {
//   let brushWidth: number;
//   let brushHeight: number;

//   if (typeof dimension === 'number') {
//     brushWidth = dimension;
//     brushHeight = dimension;
//   } else {
//     brushWidth = dimension.x;
//     brushHeight = dimension.y;
//   }

//   brushWidth = Math.max(1, brushWidth);
//   brushHeight = Math.max(1, brushHeight);

//   const brushStampData = new Uint8ClampedArray(brushWidth * brushHeight * 4);

//   for (let i = 3; i < brushStampData.length; i += 4) {
//     brushStampData[i] = 0;
//   }

//   const [brushR, brushG, brushB, brushA] = color.toRGBA();

//   if (isRound && brushWidth === 1 && brushHeight === 1) {
//     brushStampData[0] = brushR;
//     brushStampData[1] = brushG;
//     brushStampData[2] = brushB;
//     brushStampData[3] = Math.round(brushA * maxAlphaFactor);
//     return brushStampData;
//   }
//   // --- ENDE SPEZIELLE BEHANDLUNG ---

//   const centerX = brushWidth / 2;
//   const centerY = brushHeight / 2;

//   const effectiveRadius = Math.min(brushWidth, brushHeight) / 2;

//   for (let i = 0; i < numDots; i++) {
//     let dotX, dotY;

//     if (isRound) {
//       const angle = Math.random() * 2 * Math.PI;
//       const dist = Math.random() * effectiveRadius;

//       dotX = Math.round(centerX + dist * Math.cos(angle));
//       dotY = Math.round(centerY + dist * Math.sin(angle));

//       const distanceToCenter = Math.sqrt(
//         Math.pow(dotX - centerX, 2) + Math.pow(dotY - centerY, 2)
//       );

//       const clampedDistanceToCenter = Math.min(
//         distanceToCenter,
//         effectiveRadius
//       );
//       const alphaMultiplier = 1 - clampedDistanceToCenter / effectiveRadius;

//       const dotAlpha = Math.round(brushA * alphaMultiplier * maxAlphaFactor);

//       if (dotX < 0 || dotX >= brushWidth || dotY < 0 || dotY >= brushHeight) {
//         continue;
//       }

//       const index = (dotY * brushWidth + dotX) * 4;
//       brushStampData[index + 0] = brushR;
//       brushStampData[index + 1] = brushG;
//       brushStampData[index + 2] = brushB;
//       brushStampData[index + 3] = dotAlpha;
//     } else {
//       dotX = Math.floor(Math.random() * brushWidth);
//       dotY = Math.floor(Math.random() * brushHeight);

//       const dotAlpha = Math.round(brushA * maxAlphaFactor);

//       const index = (dotY * brushWidth + dotX) * 4;

//       brushStampData[index + 0] = brushR;
//       brushStampData[index + 1] = brushG;
//       brushStampData[index + 2] = brushB;
//       brushStampData[index + 3] = dotAlpha;
//     }
//   }

//   return brushStampData;
// }
