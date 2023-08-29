import { normalizeColorHex } from './color';
import { loadImage } from './image';

export function pixelratedCanvas(
  ctx,
  ignoredColors = ['#000000'],
  newCtx = true
) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[Number(i)];
    const g = data[i + 1];
    const b = data[i + 2];

    if (
      !ignoredColors.includes(
        normalizeColorHex(
          `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`
        )
      ) ||
      data[i + 3] !== 255
    ) {
      data[i + 3] = 0;
      // const v = 0.2126 * r + 0.7152 * g + 0.0722 * b >= 50 ? 255 : 0;
      // if (0.2126 * r + 0.7152 * g + 0.0722 * b >= 50) {
      //   data[Number(i)] = data[i + 1] = data[i + 2] = v;
      // }
    }
  }

  if (newCtx) {
    ctx = new OffscreenCanvas(imageData.width, imageData.height).getContext(
      '2d'
    );
  }
  ctx.putImageData(imageData, 0, 0);

  return ctx.canvas;
}

export const invertCanvas = canvas => {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

export const canvasToImageData = canvas => {
  const ctx = canvas.getContext('2d');
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

export const getCanvasFromImage = async path => {
  const img = await loadImage(path);
  const canvas = new OffscreenCanvas(img.width, img.height);
  canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
  return canvas;
};

export const getResizedCanvas = (canvas, width) => {
  const height = width * (canvas.height / canvas.width);

  const resizedCanvas = new OffscreenCanvas(width, height);
  resizedCanvas.getContext('2d').drawImage(canvas, 0, 0, width, height);
  return resizedCanvas;
};

export const cloneCanvas = canvas => {
  const clone = new OffscreenCanvas(canvas.width, canvas.height);
  const ctx = clone.getContext('2d');
  ctx.drawImage(canvas, 0, 0);
  return clone;
};

export const flipCanvas = (canvas, horizontal, vertical) => {
  const mirrorCanvas = new OffscreenCanvas(canvas.width, canvas.height);
  const ctx = mirrorCanvas.getContext('2d');
  const x = 1 - horizontal * 2;
  const y = 1 - vertical * 2;
  ctx.translate(horizontal * canvas.width, vertical * canvas.height);
  ctx.scale(x, y);
  ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
  return mirrorCanvas;
};

export const rotateCanvas90Deg = canvas => {
  let ctx = canvas.getContext('2d');
  const rotatedCanvas = new OffscreenCanvas(canvas.height, canvas.width);
  ctx = rotatedCanvas.getContext('2d');
  ctx.translate(canvas.height, 0);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(canvas, 0, 0);
  return rotatedCanvas;
};

export async function debugCanvas(canvas) {
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
