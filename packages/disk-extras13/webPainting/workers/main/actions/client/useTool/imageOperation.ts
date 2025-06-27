/* eslint-disable complexity */
import type {
  ImageOperationOptions,
  ImageOperationOptionsBlur,
  ImageOperationOptionsBrightness,
  ImageOperationOptionsContrast,
  ImageOperationOptionsEmboss,
  ImageOperationOptionsSaturation,
  ImageOperationOptionsSharpen
} from '@web-workbench/disk-extras13/webPainting/lib/classes/tool/interaction/ImageOperation';
import {
  IMAGE_OPERATION,
  type Context
} from '@web-workbench/disk-extras13/webPainting/types/main';
import * as operations from '@web-workbench/disk-extras13/webPainting/utils/imageOperations';

export default function (context: Context, options: ImageOperationOptions) {
  const dimension = context.getDimension();

  switch (options.type) {
    case IMAGE_OPERATION.GRAYSCALE:
      {
        context.view?.set(operations.grayscale(context.view!));
      }
      break;
    case IMAGE_OPERATION.INVERT:
      {
        context.view?.set(operations.invert(context.view!));
      }
      break;
    case IMAGE_OPERATION.SEPIA:
      {
        context.view?.set(operations.sepia(context.view!));
      }
      break;
    case IMAGE_OPERATION.BRIGHTNESS:
      {
        context.view?.set(
          operations.adjustBrightness(
            context.view!,
            (options as ImageOperationOptionsBrightness).value / 100
          )
        );
      }
      break;
    case IMAGE_OPERATION.CONTRAST:
      {
        context.view?.set(
          operations.adjustContrast(
            context.view!,
            (options as ImageOperationOptionsContrast).value
          )
        );
      }
      break;
    case IMAGE_OPERATION.SATURATION:
      {
        context.view?.set(
          operations.adjustSaturation(
            context.view!,
            (options as ImageOperationOptionsSaturation).value
          )
        );
      }
      break;
    case IMAGE_OPERATION.SHARPEN:
      {
        context.view?.set(
          operations.sharpen(
            context.view!,
            dimension.x,
            dimension.y,
            (options as ImageOperationOptionsSharpen).value
          )
        );
      }
      break;
    case IMAGE_OPERATION.BLUR:
      {
        context.view?.set(
          operations.blur(
            context.view!,
            dimension.x,
            dimension.y,
            (options as ImageOperationOptionsBlur).value
          )
        );
      }
      break;
    case IMAGE_OPERATION.EMBOSS:
      {
        context.view?.set(
          operations.emboss(
            context.view!,
            dimension.x,
            dimension.y,
            (options as ImageOperationOptionsEmboss).value
          )
        );
      }
      break;
  }
}

// BRIGHTNESS
// CONTRAST
// SATURATION
// SHARPEN
// BLUR
// EMBOSS
// EDGE_DETECT
// THRESHOLD
// COLORIZE
