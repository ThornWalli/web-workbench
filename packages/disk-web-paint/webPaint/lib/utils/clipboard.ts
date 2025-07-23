import { imageDataToCanvas } from '@web-workbench/core/utils/canvas';

export async function copyImageToClipboard(
  imageData,
  options: ImageEncodeOptions = {
    type: 'image/png',
    quality: 1
  }
) {
  const canvas = await imageDataToCanvas(imageData);
  const blob = await canvas.convertToBlob(options);
  await navigator.clipboard.write([
    new ClipboardItem({
      [options.type]: blob
    })
  ]);
}
