import { ipoint } from '@js-basics/vector';
import type { Context } from '../../types/worker/display';
import {
  drawGrid,
  drawPixelGrid,
  getCanvasFromImageData,
  ORIGIN_TRANSLATE
} from './utils/render';
import type { PlacementDescription } from './types';

export function render(
  context: Context,
  imageData: ImageData | undefined = context.lastImageData
) {
  if (context.canvas && context.ctx && imageData) {
    context.lastImageData = imageData;

    const canvas = getCanvasFromImageData(imageData);

    context.ctx.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const offscreenCanvasDimension = context.getDimensionOffscreenCanvas();
    const imageDataDimension = context.getDimensionImageData();
    const scaledImageDataDimension = context.getDimensionImageData(true);

    const originTranslate = ipoint(
      () =>
        ((offscreenCanvasDimension - scaledImageDataDimension) / 2 +
          (offscreenCanvasDimension - scaledImageDataDimension) *
            ORIGIN_TRANSLATE[context.options.origin]) /
        scaledImageDataDimension
    );

    let cropPosition = ipoint(() => imageDataDimension * originTranslate * -1);

    const cropDimension = ipoint(
      () =>
        (offscreenCanvasDimension / scaledImageDataDimension) *
        imageDataDimension
    );

    const normalizedPosition = ipoint(
      () => context.options.position * imageDataDimension
    );

    cropPosition = ipoint(() => normalizedPosition + cropPosition);

    const crop: PlacementDescription = {
      position: cropPosition,
      dimension: cropDimension
    };

    const target: PlacementDescription = {
      position: ipoint(0, 0),
      dimension: offscreenCanvasDimension
    };

    // console.log(
    //   'drawImage',
    //   JSON.stringify(
    //     {
    //       originTranslate: originTranslate.toArray(),
    //       position: context.options.position.toArray(),
    //       normalizedPosition: normalizedPosition.toArray(),

    //       ['scaledImageDataDimension.x']: scaledImageDataDimension.x,
    //       ['scaledImageDataDimension.y']: scaledImageDataDimension.y,
    //       ['crop.position.x']: crop.position.x,
    //       ['crop.position.y']: crop.position.y,
    //       ['crop.dimension.x']: crop.dimension.x,
    //       ['crop.dimension.y']: crop.dimension.y,
    //       ['target.position.x']: target.position.x,
    //       ['target.position.y']: target.position.y,
    //       ['target.dimension.x']: target.dimension.x,
    //       ['target.dimension.y']: target.dimension.y
    //     },
    //     null,
    //     2
    //   )
    // );

    context.ctx.drawImage(
      canvas,
      crop.position.x,
      crop.position.y,
      crop.dimension.x,
      crop.dimension.y,
      target.position.x,
      target.position.y,
      target.dimension.x,
      target.dimension.y
    );
    drawPixelGrid(
      context,
      context.ctx,
      crop,
      context.options.pixelGrid.color,
      context.options.pixelGrid.lineWidth,
      context.options.pixelGrid.visibleCount
    );

    drawGrid(context, context.ctx, crop, context.options.grid);

    // debugDraw(context.ctx);
  } else {
    throw new Error(
      'Display render failed: Offscreen canvas or context is not available.'
    );
  }
}
