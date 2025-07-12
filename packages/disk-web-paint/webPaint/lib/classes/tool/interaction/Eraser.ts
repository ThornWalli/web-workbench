import { TOOLS } from '@web-workbench/disk-web-paint/webPaint/types/select';
import ContinuousFreehand from './ContinuousFreehand';
import type { ContinuousFreehandOptions } from './ContinuousFreehand';
import type { ToolConstructorOptions } from '../../Tool';

export type EraserOptions = ContinuousFreehandOptions;

export default class Eraser extends ContinuousFreehand<EraserOptions> {
  constructor(options: ToolConstructorOptions<EraserOptions>) {
    super({
      ...options,
      type: TOOLS.ERASER,
      options: {
        ...options.options,
        replaceColor: true
      }
    });
  }
}
