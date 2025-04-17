import { normalizeColorHex } from './color';
import { loadImage } from './image';

export function pixelratedCanvas(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  ignoredColors = ['#000000'],
  newCtx = false
) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[Number(i)];
    const g = data[i + 1];
    const b = data[i + 2];

    const hex = normalizeColorHex(
      `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
    );
    if (!ignoredColors.includes(hex) || data[i + 3] !== 255) {
      data[i + 3] = 0;
    }
  }

  if (newCtx) {
    ctx = new OffscreenCanvas(imageData.width, imageData.height).getContext(
      '2d'
    ) as OffscreenCanvasRenderingContext2D;
  }
  ctx.putImageData(imageData, 0, 0);

  return ctx.canvas;
}

export function invertCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[Number(i)] = 255 - data[Number(i)];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function canvasToImageData(canvas: HTMLCanvasElement | OffscreenCanvas) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export async function getCanvasFromImage(path: string) {
  const img = await loadImage(path);
  const canvas = new OffscreenCanvas(img.width, img.height);
  canvas.getContext('2d')?.drawImage(img, 0, 0, img.width, img.height);
  return canvas;
}

export function getResizedCanvas(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  width: number
) {
  const height = width * (canvas.height / canvas.width);

  const resizedCanvas = new OffscreenCanvas(width, height);
  const ctx = resizedCanvas.getContext(
    '2d'
  ) as OffscreenCanvasRenderingContext2D;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, width, height);
  return resizedCanvas;
}

export function cloneCanvas(canvas: HTMLCanvasElement | OffscreenCanvas) {
  const clone = new OffscreenCanvas(canvas.width, canvas.height);
  const ctx = clone.getContext('2d') as OffscreenCanvasRenderingContext2D;
  ctx.drawImage(canvas, 0, 0);
  return clone;
}

export function flipCanvas(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  horizontal: number,
  vertical: number
) {
  const mirrorCanvas = new OffscreenCanvas(canvas.width, canvas.height);
  const ctx = mirrorCanvas.getContext(
    '2d'
  ) as OffscreenCanvasRenderingContext2D;
  const x = 1 - horizontal * 2;
  const y = 1 - vertical * 2;
  ctx.translate(horizontal * canvas.width, vertical * canvas.height);
  ctx.scale(x, y);
  ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
  return mirrorCanvas;
}

export function rotateCanvas90Deg(canvas: HTMLCanvasElement | OffscreenCanvas) {
  let ctx = canvas.getContext('2d');
  const rotatedCanvas = new OffscreenCanvas(canvas.height, canvas.width);
  ctx = rotatedCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  ctx.translate(canvas.height, 0);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(canvas, 0, 0);
  return rotatedCanvas;
}

export async function debugCanvas(canvas: OffscreenCanvas) {
  try {
    const blob = await canvas.convertToBlob();
    const fileReader = new FileReader();
    const dataUri = await new Promise(resolve => {
      fileReader.readAsDataURL(blob);
      fileReader.onload = () => resolve(fileReader.result);
    });
    const style = `font-size: ${canvas.height}px; background-image: url("${dataUri}"); background-size: contain; background-repeat: no-repeat;`;
    console.log('%c     ', style);
  } catch (e) {
    console.error(e);
  }
}
