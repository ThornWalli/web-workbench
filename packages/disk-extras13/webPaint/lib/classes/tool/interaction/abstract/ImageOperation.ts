import { TOOLS } from '../../../../../types/select';
import type { ToolConstructorOptions, ToolUseOptions } from '../../../Tool';
import type { IMAGE_OPERATION } from '../../../../../types/main';
import AbstractTool from '../../AbstractTool';

export interface ImageOperationOptions extends ToolUseOptions {
  type: IMAGE_OPERATION;
}

interface ValueOptions extends ImageOperationOptions {
  value: number;
}
export type ImageOperationOptionsBrightness = ValueOptions;
export type ImageOperationOptionsContrast = ValueOptions;
export type ImageOperationOptionsSaturation = ValueOptions;

export type ImageOperationOptionsSharpen = ValueOptions;
export type ImageOperationOptionsBlur = ValueOptions;
export type ImageOperationOptionsEmboss = ValueOptions;

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
      type: TOOLS.IMAGE_OPERATION,
      options: {
        stackable: true
      }
    });
  }
}
