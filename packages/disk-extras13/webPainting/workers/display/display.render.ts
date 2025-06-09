import { ipoint } from '@js-basics/vector';
import type { Context } from '../../types/display';
import {
  drawRaster,
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
    drawRaster(context, context.ctx, crop);

    // debugDraw(context.ctx);
  } else {
    throw new Error(
      'Display render failed: Offscreen canvas or context is not available.'
    );
  }
}

// function calculateZoomBounds(
//   srcDimension: IPoint & number,
//   destDimension: IPoint & number,
//   position: IPoint & number,
//   factor: number
// ) {
//   factor = factor || 1;
//   debugger;

//   position = ipoint(() => Math.floor(position * srcDimension));

//   const maxDisplayFactor = ipoint(() => destDimension / srcDimension);

//   const cropSize = ipoint(() =>
//     Math.ceil(
//       Math.min((maxDisplayFactor / factor) * srcDimension, srcDimension)
//     )
//   );
//   const min = ipoint(() =>
//     Math.min(
//       Math.max(position - Math.ceil(cropSize / 2), 0),
//       srcDimension - cropSize
//     )
//   );
//   const max = ipoint(() => min + cropSize);
//   // this.setOffset(this.zoomBounds.min);
//   // console.log({
//   //   position: position.toString(),
//   //   min: min.toString(),
//   //   max: max.toString(),
//   //   cropSize: cropSize.toString()
//   //   // position: position.toString(),
//   //   // sourceSize: sourceSize.toString(),
//   //   // size: size.toString(),
//   //   // maxDisplayFactor: maxDisplayFactor.toString(),
//   //   // maxDisplayFactor_: ipoint(() => Math.floor(Math.min(maxDisplayFactor / factor * sourceSize, sourceSize))).toString(),
//   //   // test: maxDisplayFactor.x * maxDisplayFactor.y
//   // }
//   // );

//   return {
//     position: min,
//     dimension: max
//   };

//   //   const srcSize = this.canvasSize;
//   //   const size = ipoint(() => Math.ceil(srcSize / factor));
//   //   const halfSize = ipoint(() => size / 2);

//   //   position = point(position);

//   //   if (position.x - halfSize.x < 0) {
//   //     position.x = 0;
//   //   } else if (position.x + halfSize.x > srcSize.x) {
//   //     position.x = srcSize.x - size.x;
//   //   } else {
//   //     position.x -= halfSize.x;
//   //   }

//   //   if (position.y - halfSize.y < 0) {
//   //     position.y = 0;
//   //   } else if (position.y + halfSize.y > srcSize.y) {
//   //     position.y = srcSize.y - size.y;
//   //   } else {
//   //     position.y -= halfSize.y;
//   //   }

//   //   const offset = new Bounds();
//   //   offset.min = ipoint(() => Math.ceil(position));
//   //   offset.max = ipoint(() => Math.ceil(position + size));
//   //   return offset;
// }
