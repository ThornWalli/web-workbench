import { ipoint } from '@js-basics/vector';
import type { PlacementDescription } from '../types';
import Color from '@web-workbench/disk-web-paint/webPaint/lib/classes/Color';
import { DISPLAY_ORIGIN } from '@web-workbench/disk-web-paint/webPaint/types/display';
import type { Grid } from '@web-workbench/disk-web-paint/webPaint/types/display';
import type { IContext } from '@web-workbench/disk-web-paint/webPaint/types/worker/display';
import { BLEND_MODE } from '@web-workbench/disk-web-paint/webPaint/types/select';

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

export function drawPixelGrid(
  context: IContext,
  ctx: OffscreenCanvasRenderingContext2D,
  placement: PlacementDescription,
  color: Color = new Color(0, 0, 0, 255 * 0.2),
  lineWidth: number = 1,
  visibleCount: number = 10
) {
  const zoomLevel = context.options.zoomLevel;
  const scaledImageDataDimension = context.getDimensionImageData(true);

  const gridSize = ipoint(() => scaledImageDataDimension / zoomLevel);
  const cellDimension = ipoint(() => scaledImageDataDimension / gridSize);
  const gridStartPosition = ipoint(() => placement.position * zoomLevel * -1);

  ctx.lineWidth = lineWidth;
  ctx.strokeRect(
    gridStartPosition.x,
    gridStartPosition.y,
    scaledImageDataDimension.x,
    scaledImageDataDimension.y
  );

  if (cellDimension.x < visibleCount) {
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

export function drawGrid(
  context: IContext,
  ctx: OffscreenCanvasRenderingContext2D,
  placement: PlacementDescription,
  options: Grid
) {
  if (!options.active) {
    return;
  }
  const zoomLevel = context.options.zoomLevel;
  const scaledImageDataDimension = context.getDimensionImageData(true);

  const gridCount = options.dimension;

  const gridSize = ipoint(
    () => (scaledImageDataDimension / zoomLevel / options.dimension) * 2
  );
  let cellDimension = ipoint(() => scaledImageDataDimension / gridSize);
  cellDimension = ipoint(() => (cellDimension * gridSize) / (2 * gridCount));

  const gridStartPosition = ipoint(() => placement.position * zoomLevel * -1);
  const offset = ipoint(() => options.position * cellDimension);

  const dimension = ipoint(() => scaledImageDataDimension / cellDimension);
  // #region primary grid
  let path = new Path2D();
  path.moveTo(
    offset.x + gridStartPosition.x + scaledImageDataDimension.x / 2,
    gridStartPosition.y
  );
  path.lineTo(
    offset.x + gridStartPosition.x + scaledImageDataDimension.x / 2,
    gridStartPosition.y + scaledImageDataDimension.y
  );
  path.moveTo(
    gridStartPosition.x,
    offset.y + gridStartPosition.y + scaledImageDataDimension.y / 2
  );
  path.lineTo(
    gridStartPosition.x + scaledImageDataDimension.x,
    offset.y + gridStartPosition.y + scaledImageDataDimension.y / 2
  );

  ctx.lineWidth = 2;
  ctx.strokeStyle = `rgba(${options.colors.primary.toCSSRGBA()})`;
  ctx.stroke(path);
  // #endregion

  path = new Path2D();
  for (let x = 0; x <= dimension.x; x++) {
    path.moveTo(gridStartPosition.x + cellDimension.x * x, gridStartPosition.y);
    path.lineTo(
      gridStartPosition.x + cellDimension.x * x,
      gridStartPosition.y + scaledImageDataDimension.y
    );
  }
  for (let y = 0; y <= dimension.y; y++) {
    path.moveTo(gridStartPosition.x, gridStartPosition.y + cellDimension.y * y);
    path.lineTo(
      gridStartPosition.x + scaledImageDataDimension.x,
      gridStartPosition.y + cellDimension.y * y
    );
  }

  // ctx.globalCompositeOperation = 'xor';
  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgba(${options.colors.secondary.toCSSRGBA()})`;
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

// eslint-disable-next-line complexity
export function getGlobalCompositeOperation(blendModel: BLEND_MODE) {
  switch (blendModel) {
    case BLEND_MODE.NORMAL:
      return 'source-over';
    case BLEND_MODE.MULTIPLY:
      return 'multiply';
    case BLEND_MODE.SCREEN:
      return 'screen';
    case BLEND_MODE.OVERLAY:
      return 'overlay';
    case BLEND_MODE.DARKEN:
      return 'darken';
    case BLEND_MODE.LIGHTEN:
      return 'lighten';
    case BLEND_MODE.COLOR_DODGE:
      return 'color-dodge';
    case BLEND_MODE.COLOR_BURN:
      return 'color-burn';
    case BLEND_MODE.HARD_LIGHT:
      return 'hard-light';
    case BLEND_MODE.SOFT_LIGHT:
      return 'soft-light';
    case BLEND_MODE.DIFFERENCE:
      return 'difference';
    case BLEND_MODE.EXCLUSION:
      return 'exclusion';
    default:
      return 'source-over';
  }
}
