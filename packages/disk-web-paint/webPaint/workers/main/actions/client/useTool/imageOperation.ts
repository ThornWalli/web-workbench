import type {
  ImageOperationOptions,
  ImageOperationOptionsBlur,
  ImageOperationOptionsBrightness,
  ImageOperationOptionsContrast,
  ImageOperationOptionsEmboss,
  ImageOperationOptionsSaturation,
  ImageOperationOptionsSharpen
} from '@web-workbench/disk-web-paint/webPaint/lib/classes/tool/interaction/abstract/ImageOperation';
import { IMAGE_OPERATION } from '@web-workbench/disk-web-paint/webPaint/types/worker/main';
import type { IContext } from '@web-workbench/disk-web-paint/webPaint/types/worker/main';
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
} from '@web-workbench/wasm';

export default function (context: IContext, options: ImageOperationOptions) {
  const dimension = toDimension(context.getDimension());

  switch (options.type) {
    case IMAGE_OPERATION.GRAYSCALE:
      {
        grayScale(context.view!, dimension);
      }
      break;
    case IMAGE_OPERATION.INVERT:
      {
        invert(context.view!, dimension);
      }
      break;
    case IMAGE_OPERATION.SEPIA:
      {
        sepia(context.view!, dimension);
      }
      break;
    case IMAGE_OPERATION.BRIGHTNESS:
      {
        adjustBrightness(
          context.view!,
          dimension,
          (options as ImageOperationOptionsBrightness).value / 100
        );
      }
      break;
    case IMAGE_OPERATION.CONTRAST:
      {
        adjustContrast(
          context.view!,
          dimension,
          (options as ImageOperationOptionsContrast).value / 100
        );
      }
      break;
    case IMAGE_OPERATION.SATURATION:
      {
        adjustSaturation(
          context.view!,
          dimension,
          (options as ImageOperationOptionsSaturation).value / 100
        );
      }
      break;
    case IMAGE_OPERATION.SHARPEN:
      {
        const { radius, threshold } = options as ImageOperationOptionsSharpen;
        sharpen(context.view!, dimension, radius, threshold);
      }
      break;
    case IMAGE_OPERATION.BLUR:
      {
        blur(
          context.view!,
          dimension,
          (options as ImageOperationOptionsBlur).value
        );
      }
      break;
    case IMAGE_OPERATION.EMBOSS:
      {
        emboss(
          context.view!,
          dimension,
          (options as ImageOperationOptionsEmboss).value / 100
        );
      }
      break;
  }
  context.updateTmpView();
}
