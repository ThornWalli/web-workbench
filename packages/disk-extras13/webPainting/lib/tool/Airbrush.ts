import type { BrushToolOptions } from './Brush';
import DottedFreehand from './DottedFreehand';

export default class AirBrush extends DottedFreehand {
  constructor(options: BrushToolOptions) {
    super({ pointerDownHold: true, ...options });
  }
}
