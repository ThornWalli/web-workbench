import { TOOLS } from '@web-workbench/disk-web-paint/webPaint/types/select';
import type { ToolConstructorOptions } from '../../Tool';
import DottedFreehand from './DottedFreehand';
import type { DottedFreehandOptions } from './DottedFreehand';

export type ContinuousFreehandOptions = DottedFreehandOptions;

export default class ContinuousFreehand<
  TOptions extends ContinuousFreehandOptions = ContinuousFreehandOptions
> extends DottedFreehand<TOptions> {
  constructor(options: ToolConstructorOptions<TOptions>) {
    super({
      ...options,
      type: options.type || TOOLS.CONTINUOUS_FREEHAND
    });
  }
}
