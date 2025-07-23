import type { IPoint } from '@js-basics/vector';

export async function getImageDataFromView(
  view: Uint8Array | Uint8ClampedArray,
  dimension: IPoint & number
) {
  view = new Uint8ClampedArray(view);
  return new ImageData(view, dimension.x, dimension.y);
}
