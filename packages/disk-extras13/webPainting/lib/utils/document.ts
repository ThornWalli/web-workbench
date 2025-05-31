import { getCanvasFromImage } from '@web-workbench/core/utils/canvas';
import { Document } from '../classes/Document';
import { ipoint } from '@js-basics/vector';

// export function getCanvas(doc: Document): Promise<OffscreenCanvas> {
//   return getCanvasFromImage(doc.data);
// }

// export async function getTransferableImageBitmap(doc: Document) {
//   return (await getCanvas(doc)).transferToImageBitmap();
// }

export async function loadDocumentFromImage(url: string) {
  const canvas = await getCanvasFromImage(url);
  const meta = {
    dimension: ipoint(canvas.width, canvas.height)
  };
  return new Document({
    name: 'Loaded Document',
    meta,
    data: canvas.transferToImageBitmap()
  });
}

export function createImageBitmap(width: number, height: number): ImageBitmap {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context from OffscreenCanvas');
  }
  ctx.fillStyle = 'white'; // Default background color
  ctx.fillRect(0, 0, width, height);
  return canvas.transferToImageBitmap();
}

export function getBlankDocument(): Document {
  return new Document({
    name: 'Blank Document',
    meta: {
      dimension: ipoint(300, 240)
    },
    data: createImageBitmap(300, 240)
  });
}
