import {
  imageBitmapToCanvas,
  imageToCanvas,
  urlToCanvas
} from '@web-workbench/core/utils/canvas';
import { Document } from '../classes/Document';
import { ipoint } from '@js-basics/vector';
import type { Format } from '../../utils/formats';
import Color from '../classes/Color';

export async function getDocumentFromUrl(url: string) {
  const canvas = await urlToCanvas(url);
  const meta = {
    colors: {
      background: new Color(255, 255, 255)
    },
    dimension: ipoint(canvas.width, canvas.height)
  };
  return new Document({
    name: 'Untitled Document',
    meta,
    data: canvas.transferToImageBitmap()
  });
}

export async function getDocumentFromFile(file: File): Promise<Document> {
  const canvas = await imageBitmapToCanvas(await createImageBitmap(file));
  const meta = {
    colors: {
      background: new Color(255, 255, 255)
    },
    dimension: ipoint(canvas.width, canvas.height)
  };
  return new Document({
    name: file.name || 'Untitled Document',
    meta,
    data: canvas.transferToImageBitmap()
  });
}

export async function getDocumentFromBlob(blob: Blob): Promise<Document> {
  const canvas = await imageBitmapToCanvas(await createImageBitmap(blob));
  const meta = {
    colors: {
      background: new Color(255, 255, 255)
    },
    dimension: ipoint(canvas.width, canvas.height)
  };
  return new Document({
    name: 'Untitled Document',
    meta,
    data: canvas.transferToImageBitmap()
  });
}

export function getDocumentFromImageBitmap(imageBitmap: ImageBitmap): Document {
  const meta = {
    colors: {
      background: new Color(255, 255, 255)
    },
    dimension: ipoint(imageBitmap.width, imageBitmap.height)
  };
  return new Document({
    name: 'Untitled Document',
    meta,
    data: imageBitmap
  });
}

export async function getDocumentFromImage(
  image: HTMLImageElement
): Promise<Document> {
  const canvas = await imageToCanvas(image);
  const meta = {
    colors: {
      background: new Color(255, 255, 255)
    },
    dimension: ipoint(canvas.width, canvas.height)
  };
  return new Document({
    name: 'Untitled Document',
    meta,
    data: canvas.transferToImageBitmap()
  });
}

export function createBlankImageBitmap(
  width: number,
  height: number
): ImageBitmap {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context from OffscreenCanvas');
  }
  ctx.fillStyle = 'white'; // Default background color
  ctx.fillRect(0, 0, width, height);
  return canvas.transferToImageBitmap();
}

export function getBlankDocument(dimension = ipoint(300, 240)): Document {
  return new Document({
    name: 'Blank Document',
    meta: {
      colors: {
        background: new Color(255, 255, 255)
      },
      dimension
    },
    data: createBlankImageBitmap(dimension.x, dimension.y)
  });
}

export function getDocumentByFormat(format: Format): Document {
  return new Document({
    name: 'Blank Document',
    meta: {
      colors: {
        background: new Color(255, 255, 255)
      },
      dimension: ipoint(format.dimension.x, format.dimension.y)
    },
    data: createBlankImageBitmap(format.dimension.x, format.dimension.y)
  });
}
