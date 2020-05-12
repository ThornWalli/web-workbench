
import 'pepjs';
import { ipoint } from '@js-basics/vector';

export function getNormalizedPointer (e, boundingClientRect) {
  const { x, y, width, height } = boundingClientRect;
  const elemPos = ipoint(x, y);
  const elemHalfSize = ipoint(() => ipoint(width, height) / 2);
  const touchPos = ipoint(e.x, e.y);
  return ipoint(() => (touchPos - elemPos - elemHalfSize) / elemHalfSize);
}
