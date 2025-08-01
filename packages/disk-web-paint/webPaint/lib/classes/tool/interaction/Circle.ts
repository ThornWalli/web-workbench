import Ellipse from './Ellipse';
import type { EllipseOptions } from './Ellipse';
import type { ToolConstructorOptions } from '../../Tool';
import { TOOL } from '../../../../types/select';

export type CircleOptions = EllipseOptions;

export default class Circle extends Ellipse<CircleOptions> {
  constructor(options: ToolConstructorOptions<CircleOptions>) {
    super({
      ...options,
      type: TOOL.CIRCLE,
      options: {
        ...options.options,
        square: true
      }
    });
  }
}
