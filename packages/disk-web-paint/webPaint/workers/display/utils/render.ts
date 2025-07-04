import { ipoint } from '@js-basics/vector';
import { DISPLAY_ORIGIN } from '../../../lib/classes/Display';
import type { Context } from '@web-workbench/disk-web-paint/webPaint/types/display';
import type { PlacementDescription } from '../types';
import Color from '@web-workbench/disk-web-paint/webPaint/lib/classes/Color';

export const ORIGIN_TRANSLATE = {
  [DISPLAY_ORIGIN.TOP_LEFT]: ipoint(-0.5, -0.5),
  [DISPLAY_ORIGIN.TOP_CENTER]: ipoint(0, -0.5),
  [DISPLAY_ORIGIN.TOP_RIGHT]: ipoint(0.5, -0.5),
  [DISPLAY_ORIGIN.CENTER_LEFT]: ipoint(-0.5, 0),
  [DISPLAY_ORIGIN.CENTER]: ipoint(0, 0),
  [DISPLAY_ORIGIN.CENTER_RIGHT]: ipoint(0.5, 0),
  [DISPLAY_ORIGIN.BOTTOM_LEFT]: ipoint(-0.5, 0.5),
  [DISPLAY_ORIGIN.BOTTOM_CENTER]: ipoint(0, 0.5),
  [DISPLAY_ORIGIN.BOTTOM_RIGHT]: ipoint(0.5, 0.5)
};

const MIN_GRID_SIZE = 10;
export function drawGrid(
  context: Context,
  ctx: OffscreenCanvasRenderingContext2D,
  placement: PlacementDescription,
  color: Color = new Color(0, 0, 0, 0.2)
) {
  const zoomLevel = context.options.zoomLevel;
  const scaledImageDataDimension = context.getDimensionImageData(true);

  const gridSize = ipoint(() => scaledImageDataDimension / zoomLevel);
  const cellDimension = ipoint(() => scaledImageDataDimension / gridSize);
  const gridStartPosition = ipoint(() => placement.position * zoomLevel * -1);

  ctx.lineWidth = 1;
  ctx.strokeRect(
    gridStartPosition.x,
    gridStartPosition.y,
    scaledImageDataDimension.x,
    scaledImageDataDimension.y
  );

  if (cellDimension.x < MIN_GRID_SIZE) {
    return;
  }

  const path = new Path2D();
  for (let x = 0; x <= gridSize.x; x++) {
    path.moveTo(gridStartPosition.x + cellDimension.x * x, gridStartPosition.y);
    path.lineTo(
      gridStartPosition.x + cellDimension.x * x,
      gridStartPosition.y + scaledImageDataDimension.y
    );
  }
  for (let y = 0; y <= gridSize.y; y++) {
    path.moveTo(gridStartPosition.x, gridStartPosition.y + cellDimension.y * y);
    path.lineTo(
      gridStartPosition.x + scaledImageDataDimension.x,
      gridStartPosition.y + cellDimension.y * y
    );
  }

  // ctx.globalCompositeOperation = 'xor';
  ctx.strokeStyle = `rgba(${color.toCSSRGBA()})`;
  ctx.stroke(path);
  ctx.globalCompositeOperation = 'source-over';
}

export function debugDraw(
  ctx: OffscreenCanvasRenderingContext2D,
  color: string = 'red'
) {
  // #region debug
  const size = 10;
  ctx.fillStyle = color;
  ctx.fillRect(
    (ctx.canvas.width - size) / 2,
    (ctx.canvas.height - size) / 2,
    size,
    size
  );
  // #endregion
}

export function getCanvasFromImageData(imageData: ImageData): OffscreenCanvas {
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (ctx) {
    ctx.imageSmoothingEnabled = false;
    ctx.putImageData(imageData, 0, 0);
  }
  return canvas;
}
