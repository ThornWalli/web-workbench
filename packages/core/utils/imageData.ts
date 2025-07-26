import { loadImage } from './image';

export async function imageDataFromBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);

  let img;
  try {
    img = await loadImage(url);
  } catch (error) {
    URL.revokeObjectURL(url);
    throw new Error(`Failed to load image from blob: ${error}`);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    URL.revokeObjectURL(url);
    throw new Error('Could not get 2D rendering context for canvas.');
  }

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  ctx.drawImage(img, 0, 0);

  URL.revokeObjectURL(url);

  return ctx.getImageData(0, 0, img.width, img.height);
}

export function imageDataFromUint8Array(
  data: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number
): ImageData {
  const view = new Uint8ClampedArray(width * height * 4);
  view.set(data);
  return new ImageData(view, width, height);
}
