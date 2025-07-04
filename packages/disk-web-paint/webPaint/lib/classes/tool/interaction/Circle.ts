import Ellipse from './Ellipse';
import type { EllipseOptions } from './Ellipse';
import type { ToolConstructorOptions } from '../../Tool';
import { TOOLS } from '@web-workbench/disk-web-paint/webPaint/types/select';

export type CircleOptions = EllipseOptions;

export default class Circle extends Ellipse<CircleOptions> {
  constructor(options: ToolConstructorOptions<CircleOptions>) {
    super({
      ...options,
      type: TOOLS.CIRCLE,
      options: {
        ...options.options,
        square: true
      }
    });
  }
}
