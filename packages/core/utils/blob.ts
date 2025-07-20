import { imageBitmapToCanvas } from './canvas';

export function blobToImageBitmap(blob: Blob): Promise<ImageBitmap> {
  return createImageBitmap(blob).catch(error => {
    throw new Error(`Failed to create ImageBitmap from blob: ${error}`);
  });
}

export function blobToDataURI(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(blob);
  });
}

export function blobFromFile(file: File) {
  return new Promise<Blob>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const blob = new Blob([reader.result as ArrayBuffer], {
        type: file.type
      });
      resolve(blob);
    };
    reader.onerror = error => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

export async function blobFromImageBitmap(
  imageBitmap: ImageBitmap,
  options?: ImageEncodeOptions
) {
  return (await imageBitmapToCanvas(imageBitmap)).convertToBlob(options);
}

export async function blobFromImageData(
  imageData: ImageData,
  options?: ImageEncodeOptions
) {
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext('2d');
  ctx?.putImageData(imageData, 0, 0);
  return canvas.convertToBlob(options);
}

export function blobFromDataURI(dataURI: string) {
  const base64 = dataURI.split(',')[1];
  return blobFromBase64(base64);
}

export function blobFromBase64(base64: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray]);
}
