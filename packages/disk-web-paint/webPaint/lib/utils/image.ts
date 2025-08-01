import type { IPoint } from '@js-basics/vector';

export async function getImageDataFromView(
  view: Uint8Array | Uint8ClampedArray,
  dimension: IPoint & number
) {
  return new ImageData(new Uint8ClampedArray(view), dimension.x, dimension.y);
}
