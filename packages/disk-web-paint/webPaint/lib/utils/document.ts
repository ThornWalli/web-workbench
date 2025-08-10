import {
  imageBitmapToCanvas,
  imageToCanvas,
  urlToCanvas
} from '@web-workbench/core/utils/canvas';
import { Document } from '../classes/Document';
import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import type { Format } from '../../utils/formats';
import Color from '@web-workbench/core/classes/Color';
import { loadImage } from '@web-workbench/core/utils/image';
import { createBlankImageBitmap } from '../../utils/imageBitmap';
import type { DocumentFile, DocumentLayer } from '../../types/document';

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
    layers: [
      {
        imageBitmap: canvas.transferToImageBitmap()
      }
    ]
  });
}

function createDocument({
  background,
  dimension,
  imageBitmap
}: {
  background?: Color;
  dimension: IPoint & number;
  imageBitmap: ImageBitmap;
}): Document {
  return new Document({
    name: 'Untitled Document',
    meta: {
      colors: {
        background: background || Color.TRANSPARENT
      },
      dimension
    },
    layers: [
      {
        imageBitmap
      }
    ]
  });
}

export async function getDocumentFromImageFile(
  file: File,
  background?: Color
): Promise<Document> {
  let canvas;
  if (file.type.includes('svg')) {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    await new Promise(resolve => {
      if (image.complete) {
        resolve(image);
      } else {
        image.onload = () => resolve(image);
      }
    });
    canvas = await imageToCanvas(await loadImage(URL.createObjectURL(file)));
  } else {
    canvas = await imageBitmapToCanvas(await createImageBitmap(file));
  }
  const imageBitmap = canvas.transferToImageBitmap();
  return createDocument({
    background: background ?? Color.TRANSPARENT,
    dimension: ipoint(imageBitmap.width, imageBitmap.height),
    imageBitmap
  });
}

export async function getDocumentFromBlob(
  blob: Blob,
  background?: Color
): Promise<Document> {
  const canvas = await imageBitmapToCanvas(await createImageBitmap(blob));
  return createDocument({
    background: background ?? Color.TRANSPARENT,
    dimension: ipoint(canvas.width, canvas.height),
    imageBitmap: canvas.transferToImageBitmap()
  });
}

export function getDocumentFromImageBitmap(
  imageBitmap: ImageBitmap,
  background?: Color
): Document {
  return createDocument({
    background: background ?? Color.TRANSPARENT,
    dimension: ipoint(imageBitmap.width, imageBitmap.height),
    imageBitmap
  });
}

export async function getDocumentFromImage(
  image: HTMLImageElement,
  background?: Color
): Promise<Document> {
  const canvas = await imageToCanvas(image);
  const imageBitmap = canvas.transferToImageBitmap();
  return createDocument({
    background: background ?? Color.TRANSPARENT,
    dimension: ipoint(imageBitmap.width, imageBitmap.height),
    imageBitmap
  });
}

export function getBlankDocument(
  dimension = ipoint(300, 240),
  background?: Color
): Document {
  const imageBitmap = createBlankImageBitmap(
    dimension.x,
    dimension.y,
    background?.toHex()
  );
  return createDocument({
    background: background ?? Color.TRANSPARENT,
    dimension: ipoint(imageBitmap.width, imageBitmap.height),
    imageBitmap
  });
}

export function getDocumentByFormat(
  format: Format,
  background?: Color
): Document {
  const imageBitmap = createBlankImageBitmap(
    format.dimension.x,
    format.dimension.y,
    background?.toHex()
  );
  return createDocument({
    background: background ?? Color.TRANSPARENT,
    dimension: ipoint(imageBitmap.width, imageBitmap.height),
    imageBitmap
  });
}

export async function createDocumentFromDocumentFile(
  documentFile: DocumentFile
): Promise<Document> {
  const { name, meta, layers } = documentFile;

  const preparedLayers: DocumentLayer[] = await Promise.all(
    layers.map(async (layer): Promise<DocumentLayer> => {
      const canvas = await imageToCanvas(await loadImage(layer.dataUri));
      const result = {
        ...layer
      };
      delete result.dataUri;
      return {
        ...result,
        imageBitmap: canvas.transferToImageBitmap()
      };
    })
  );

  return new Document({
    name,
    meta,
    layers: preparedLayers
  });
}
