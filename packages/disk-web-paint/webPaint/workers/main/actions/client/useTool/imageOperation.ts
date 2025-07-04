/* eslint-disable complexity */
import type {
  ImageOperationOptions,
  ImageOperationOptionsBlur,
  ImageOperationOptionsBrightness,
  ImageOperationOptionsContrast,
  ImageOperationOptionsEmboss,
  ImageOperationOptionsSaturation,
  ImageOperationOptionsSharpen
} from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/abstract/ImageOperation';
import {
  IMAGE_OPERATION,
  type Context
} from '@web-workbench/disk-web-paint/webPaint/types/main';
import { toDimension } from '@web-workbench/disk-web-paint/webPaint/utils/wasm';
import {
  adjustBrightness,
  adjustContrast,
  adjustSaturation,
  blur,
  emboss,
  grayScale,
  invert,
  sepia,
  sharpen
} from '@web-workbench/wasm/pkg/wasm';

export default function (context: Context, options: ImageOperationOptions) {
  const dimension = toDimension(context.getDimension());

  switch (options.type) {
    case IMAGE_OPERATION.GRAYSCALE:
      {
        context.view?.set(grayScale(context.view!, dimension));
      }
      break;
    case IMAGE_OPERATION.INVERT:
      {
        context.view?.set(invert(context.view!, dimension));
      }
      break;
    case IMAGE_OPERATION.SEPIA:
      {
        context.view?.set(sepia(context.view!, dimension));
      }
      break;
    case IMAGE_OPERATION.BRIGHTNESS:
      {
        context.view?.set(
          adjustBrightness(
            context.view!,
            dimension,
            (options as ImageOperationOptionsBrightness).value / 100
          )
        );
      }
      break;
    case IMAGE_OPERATION.CONTRAST:
      {
        debugger;
        context.view?.set(
          adjustContrast(
            context.view!,
            dimension,
            (options as ImageOperationOptionsContrast).value / 100
          )
        );
      }
      break;
    case IMAGE_OPERATION.SATURATION:
      {
        context.view?.set(
          adjustSaturation(
            context.view!,
            dimension,
            (options as ImageOperationOptionsSaturation).value / 100
          )
        );
      }
      break;
    case IMAGE_OPERATION.SHARPEN:
      {
        context.view?.set(
          sharpen(
            context.view!,
            dimension,
            (options as ImageOperationOptionsSharpen).value
          )
        );
      }
      break;
    case IMAGE_OPERATION.BLUR:
      {
        context.view?.set(
          blur(
            context.view!,
            dimension,
            (options as ImageOperationOptionsBlur).value
          )
        );
      }
      break;
    case IMAGE_OPERATION.EMBOSS:
      {
        context.view?.set(
          emboss(
            context.view!,
            dimension,
            (options as ImageOperationOptionsEmboss).value / 100
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
