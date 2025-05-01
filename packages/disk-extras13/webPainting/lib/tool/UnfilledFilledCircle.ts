import { ellipse as drawEllipse } from '../paintUtils';
import type { BrushToolOptions } from './Brush';
import UnfilledFilledEllipse from './UnfilledFilledEllipse';

export default class UnfilledFilledCircle extends UnfilledFilledEllipse {
  func: typeof drawEllipse;
  constructor(options: BrushToolOptions) {
    super({
      ...options,
      proportinalScale: true
    });
    this.func = drawEllipse;
  }
}
