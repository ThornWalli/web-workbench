export function invert(imageDataArray: Uint8ClampedArray): Uint8ClampedArray {
  for (let i = 0; i < imageDataArray.length; i += 4) {
    imageDataArray[i] = 255 - imageDataArray[i];
    imageDataArray[i + 1] = 255 - imageDataArray[i + 1];
    imageDataArray[i + 2] = 255 - imageDataArray[i + 2];
  }
  return imageDataArray;
}

export function grayscale(
  imageDataArray: Uint8ClampedArray
): Uint8ClampedArray {
  for (let i = 0; i < imageDataArray.length; i += 4) {
    const r = imageDataArray[i];
    const g = imageDataArray[i + 1];
    const b = imageDataArray[i + 2];
    const avg = (r + g + b) / 3;
    imageDataArray[i] = avg;
    imageDataArray[i + 1] = avg;
    imageDataArray[i + 2] = avg;
  }
  return imageDataArray;
}

export function sepia(imageDataArray: Uint8ClampedArray): Uint8ClampedArray {
  for (let i = 0; i < imageDataArray.length; i += 4) {
    const r = imageDataArray[i];
    const g = imageDataArray[i + 1];
    const b = imageDataArray[i + 2];
    imageDataArray[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
    imageDataArray[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
    imageDataArray[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
  }
  return imageDataArray;
}

export function adjustBrightness(data: Uint8ClampedArray, value: number) {
  value = value * 255;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(data[i] + value, 0, 255);
    data[i + 1] = clamp(data[i + 1] + value, 0, 255);
    data[i + 2] = clamp(data[i + 2] + value, 0, 255);
  }
  return data;
}

export function adjustContrast(data: Uint8ClampedArray, value: number) {
  const factor = (259 * (value + 255)) / (255 * (259 - value));
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(factor * (data[i] - 128) + 128, 0, 255);
    data[i + 1] = clamp(factor * (data[i + 1] - 128) + 128, 0, 255);
    data[i + 2] = clamp(factor * (data[i + 2] - 128) + 128, 0, 255);
  }
  return data;
}

export function adjustSaturation(data: Uint8ClampedArray, value: number) {
  const factor = value / 100;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    data[i] = clamp(gray + (r - gray) * (1 + factor), 0, 255);
    data[i + 1] = clamp(gray + (g - gray) * (1 + factor), 0, 255);
    data[i + 2] = clamp(gray + (b - gray) * (1 + factor), 0, 255);
  }
  return data;
}

export function sharpen(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  value: number = 1
): Uint8ClampedArray {
  const kernel = [0, -value, 0, -value, 1 + 4 * value, -value, 0, -value, 0];
  return applyConvolution(data, width, height, kernel, 1, 0);
}

export function blur(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number = 1
): Uint8ClampedArray {
  const kernelSize = 2 * radius + 1;
  const kernel: number[] = new Array(kernelSize * kernelSize).fill(1);
  const divisor = kernelSize * kernelSize;

  return applyConvolution(data, width, height, kernel, divisor, 0);
}

export function emboss(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  strength: number = 1
): Uint8ClampedArray {
  const kernel = [
    -2 * strength,
    -strength,
    0,
    -strength,
    1,
    strength,
    0,
    strength,
    2 * strength
  ];
  return applyConvolution(data, width, height, kernel, 1, 128);
}

export function edgeDetect(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  invertColors: boolean = false
): Uint8ClampedArray {
  const newData = new Uint8ClampedArray(data.length);

  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];

  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let gxR = 0,
        gxG = 0,
        gxB = 0;
      let gyR = 0,
        gyG = 0,
        gyB = 0;

      for (let ky = 0; ky < 3; ky++) {
        for (let kx = 0; kx < 3; kx++) {
          const pixelX = x + kx - 1;
          const pixelY = y + ky - 1;

          const [pr, pg, pb] = getPixel(data, width, pixelX, pixelY);
          const sobelXValue = sobelX[ky * 3 + kx];
          const sobelYValue = sobelY[ky * 3 + kx];

          gxR += pr * sobelXValue;
          gxG += pg * sobelXValue;
          gxB += pb * sobelXValue;

          gyR += pr * sobelYValue;
          gyG += pg * sobelYValue;
          gyB += pb * sobelYValue;
        }
      }
      const magnitudeR = Math.sqrt(gxR * gxR + gyR * gyR);
      const magnitudeG = Math.sqrt(gxG * gxG + gyG * gyG);
      const magnitudeB = Math.sqrt(gxB * gxB + gyB * gyB);

      const edgeValue = Math.round((magnitudeR + magnitudeG + magnitudeB) / 3);

      let finalValue = clamp(edgeValue, 0, 255);

      if (invertColors) {
        finalValue = 255 - finalValue;
      }

      const alpha = data[(y * width + x) * 4 + 3];

      setPixel(newData, width, x, y, finalValue, finalValue, finalValue, alpha);
    }
  }
  return newData;
}

export function threshold(
  data: Uint8ClampedArray,
  thresholdValue: number = 128
): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    const value = gray > thresholdValue ? 255 : 0;

    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
  }
}

export function colorize(
  data: Uint8ClampedArray,
  targetR: number,
  targetG: number,
  targetB: number,
  opacity: number = 1.0
): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    data[i] = clamp(gray * (1 - opacity) + targetR * opacity, 0, 255);
    data[i + 1] = clamp(gray * (1 - opacity) + targetG * opacity, 0, 255);
    data[i + 2] = clamp(gray * (1 - opacity) + targetB * opacity, 0, 255);
  }
}

// #region helpers

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}
export function getPixel(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number
): [number, number, number, number] {
  const index = (y * width + x) * 4;
  if (index < 0 || index + 3 >= data.length) {
    return [0, 0, 0, 0];
  }
  return [data[index], data[index + 1], data[index + 2], data[index + 3]];
}

export function setPixel(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a: number
): void {
  const index = (y * width + x) * 4;
  if (index >= 0 && index + 3 < data.length) {
    data[index] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = a;
  }
}

function applyConvolution(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  kernel: number[],
  divisor: number = 1,
  offset: number = 0
): Uint8ClampedArray {
  const newData = new Uint8ClampedArray(data.length);
  const kernelSize = Math.sqrt(kernel.length);
  const halfKernel = Math.floor(kernelSize / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;

      for (let ky = 0; ky < kernelSize; ky++) {
        for (let kx = 0; kx < kernelSize; kx++) {
          const pixelX = x + kx - halfKernel;
          const pixelY = y + ky - halfKernel;

          const [pr, pg, pb] = getPixel(data, width, pixelX, pixelY);
          const kernelValue = kernel[ky * kernelSize + kx];

          r += pr * kernelValue;
          g += pg * kernelValue;
          b += pb * kernelValue;
        }
      }

      const alpha = data[(y * width + x) * 4 + 3]; // Alpha-Kanal beibehalten

      setPixel(
        newData,
        width,
        x,
        y,
        clamp(Math.round(r / divisor + offset), 0, 255),
        clamp(Math.round(g / divisor + offset), 0, 255),
        clamp(Math.round(b / divisor + offset), 0, 255),
        alpha
      );
    }
  }
  return newData;
}

// #endregion
