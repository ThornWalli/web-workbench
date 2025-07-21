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
  adjustBrightness as wasm_adjustBrightness,
  adjustContrast as wasm_adjustContrast,
  adjustSaturation as wasm_adjustSaturation,
  blur as wasm_blur,
  emboss as wasm_emboss,
  grayScale as wasm_grayScale,
  invert as wasm_invert,
  sepia as wasm_sepia,
  sharpen as wasm_sharpen
} from '@web-workbench/wasm';

export default function (context: IContext, options: ImageOperationOptions) {
  const dimension = toDimension(context.getDimension());

  switch (options.type) {
    case IMAGE_OPERATION.GRAYSCALE:
      {
        wasm_grayScale(context.view!, dimension);
      }
      break;
    case IMAGE_OPERATION.INVERT:
      {
        wasm_invert(context.view!, dimension);
      }
      break;
    case IMAGE_OPERATION.SEPIA:
      {
        wasm_sepia(context.view!, dimension);
      }
      break;
    case IMAGE_OPERATION.BRIGHTNESS:
      {
        wasm_adjustBrightness(
          context.view!,
          dimension,
          (options as ImageOperationOptionsBrightness).value / 100
        );
      }
      break;
    case IMAGE_OPERATION.CONTRAST:
      {
        wasm_adjustContrast(
          context.view!,
          dimension,
          (options as ImageOperationOptionsContrast).value / 100
        );
      }
      break;
    case IMAGE_OPERATION.SATURATION:
      {
        wasm_adjustSaturation(
          context.view!,
          dimension,
          (options as ImageOperationOptionsSaturation).value / 100
        );
      }
      break;
    case IMAGE_OPERATION.SHARPEN:
      {
        const { radius, threshold } = options as ImageOperationOptionsSharpen;
        wasm_sharpen(context.view!, dimension, radius, threshold);
      }
      break;
    case IMAGE_OPERATION.BLUR:
      {
        wasm_blur(
          context.view!,
          dimension,
          (options as ImageOperationOptionsBlur).value
        );
      }
      break;
    case IMAGE_OPERATION.EMBOSS:
      {
        wasm_emboss(
          context.view!,
          dimension,
          (options as ImageOperationOptionsEmboss).value / 100
        );
      }
      break;
  }
  context.updateTmpView();
}
