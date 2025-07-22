import { TOOL } from '../../../../../types/select';
import type { ToolConstructorOptions, ToolUseOptions } from '../../../Tool';
import type { IMAGE_OPERATION } from '../../../../../types/worker/main';
import AbstractTool from '../../AbstractTool';
import type { RotateType, FlipType } from '@web-workbench/wasm';

export interface ImageOperationOptions extends ToolUseOptions {
  type: IMAGE_OPERATION;
}

// export interface ValueOptions extends ImageOperationOptions {
//   value: number;
// }
export interface ImageOperationOptionsBrightness extends ImageOperationOptions {
  value: number;
}
export interface ImageOperationOptionsContrast extends ImageOperationOptions {
  value: number;
}
export interface ImageOperationOptionsSaturation extends ImageOperationOptions {
  value: number;
}

export interface ImageOperationOptionsSharpen extends ImageOperationOptions {
  radius: number;
  threshold: number;
}
export interface ImageOperationOptionsBlur extends ImageOperationOptions {
  value: number;
}
export interface ImageOperationOptionsEmboss extends ImageOperationOptions {
  value: number;
}

export interface ImageOperationOptionsRotate extends ImageOperationOptions {
  value: RotateType;
}
export interface ImageOperationOptionsFlip extends ImageOperationOptions {
  value: FlipType;
}

export default class ImageOperation extends AbstractTool<
  Omit<ImageOperationOptions, 'type'>
> {
  constructor(
    options: Omit<
      ToolConstructorOptions<ImageOperationOptions>,
      'type' | 'options'
    >
  ) {
    super({
      ...options,
      type: TOOL.IMAGE_OPERATION,
      options: {
        stackable: true
      }
    });
  }
}
