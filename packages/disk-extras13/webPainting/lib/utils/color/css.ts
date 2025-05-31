import type { Color } from '../../classes/Color';

export function colorToRGB(color: Color): string {
  return `rgb(${color.r},${color.g},${color.b})`;
}

export function colorToRGBA(color: Color): string {
  return `rgba(${color.r},${color.g},${color.b},${color.a})`;
}
