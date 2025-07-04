import { blobToDataURI } from './blob';

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function imageDataToDataURI(
  imageData: ImageData,
  mimeType: string = 'image/png',
  quality: number = 1
) {
  const tempCanvas = new OffscreenCanvas(imageData.width, imageData.height);
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx?.putImageData(imageData, 0, 0);
  const blob = await tempCanvas.convertToBlob({ type: mimeType, quality });
  return blobToDataURI(blob);
}
