export function createBlankImageBitmap(
  width: number,
  height: number,
  color?: string
): ImageBitmap {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context from OffscreenCanvas');
  }

  if (color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }
  return canvas.transferToImageBitmap();
}
