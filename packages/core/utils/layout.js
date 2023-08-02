
import { ipoint } from '@js-basics/vector';

export function getLayoutFromElement (el) {
  const { x, y, width, height } = el.getBoundingClientRect();
  return {
    size: ipoint(width, height),
    position: ipoint(x, y)
  };
}
