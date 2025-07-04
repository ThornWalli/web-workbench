import { BRUSH_TYPE } from '../types/select';
import CircleBrush from '../lib/classes/brush/Circle';
import SquareBrush from '../lib/classes/brush/Square';
import SprinkleBrush from '../lib/classes/brush/Dots';

export function getBrushData(type: BRUSH_TYPE) {
  switch (type) {
    case BRUSH_TYPE.CIRCLE:
      return CircleBrush;
    case BRUSH_TYPE.SQUARE:
      return SquareBrush;
    case BRUSH_TYPE.DOTS:
      return SprinkleBrush;

    default:
      throw new Error(`Unknown brush type: ${type}`);
  }
}
