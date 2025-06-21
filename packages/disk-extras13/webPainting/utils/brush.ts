import { ipoint, type IPoint } from '@js-basics/vector';
import { BRUSH_SIZE, BRUSH_TYPE, type BrushSelect } from '../types/select';
import CircleBrush from '../lib/classes/brush/Circle';
import SquareBrush from '../lib/classes/brush/Square';
import SprinkleBrush from '../lib/classes/brush/Dots';

export function getBrushSize(brushSelect?: BrushSelect) {
  const type = brushSelect?.type || BRUSH_TYPE.CIRCLE;
  const size = brushSelect?.size || BRUSH_SIZE.SMALL;
  if (!BRUSH_SIZE_VALUE[type] || !BRUSH_SIZE_VALUE[type][size]) {
    throw new Error(`Invalid brush type or size: ${type}, ${size}`);
  }
  return BRUSH_SIZE_VALUE[type][size];
}

export const BRUSH_SIZE_VALUE: {
  [type in BRUSH_TYPE]: Partial<{
    [size in BRUSH_SIZE]: IPoint & number;
  }>;
} = {
  [BRUSH_TYPE.CIRCLE]: {
    [BRUSH_SIZE.SMALL]: ipoint(1, 1),
    [BRUSH_SIZE.MEDIUM]: ipoint(3, 3),
    [BRUSH_SIZE.LARGE]: ipoint(5, 5),
    [BRUSH_SIZE.XLARGE]: ipoint(7, 7)
  },
  [BRUSH_TYPE.SQUARE]: {
    [BRUSH_SIZE.SMALL]: ipoint(2, 2),
    [BRUSH_SIZE.MEDIUM]: ipoint(4, 4),
    [BRUSH_SIZE.LARGE]: ipoint(6, 6),
    [BRUSH_SIZE.XLARGE]: ipoint(8, 8)
  },
  [BRUSH_TYPE.DOTS]: {
    [BRUSH_SIZE.SMALL]: ipoint(4, 4),
    [BRUSH_SIZE.MEDIUM]: ipoint(8, 8)
  }
};

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
