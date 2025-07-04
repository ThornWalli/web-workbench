/**
 * Skaliert ein Bild, das als Uint8ClampedArray vorliegt,
 * unter Verwendung des Nächster-Nachbar-Algorithmus.
 */
export function resizeImageNearestNeighbor(
  sourceArray: Uint8Array,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
) {
  const targetArray = new Uint8ClampedArray(targetWidth * targetHeight * 4); // 4 Kanäle (RGBA)

  // Berechne die Skalierungsfaktoren
  const xScale = sourceWidth / targetWidth;
  const yScale = sourceHeight / targetHeight;

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const sourceX = Math.floor(x * xScale);
      const sourceY = Math.floor(y * yScale);

      const sourceIndex = (sourceY * sourceWidth + sourceX) * 4;
      const targetIndex = (y * targetWidth + x) * 4;

      targetArray[targetIndex] = sourceArray[sourceIndex]; // Rot
      targetArray[targetIndex + 1] = sourceArray[sourceIndex + 1]; // Grün
      targetArray[targetIndex + 2] = sourceArray[sourceIndex + 2]; // Blau
      targetArray[targetIndex + 3] = sourceArray[sourceIndex + 3]; // Alpha
    }
  }

  return targetArray;
}

/**
 * Skaliert ein Bild, das als Uint8ClampedArray vorliegt,
 * unter Verwendung des Bilinearen Interpolations-Algorithmus.
 */
export function resizeImageBilinear(
  sourceArray: Uint8Array,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
) {
  const targetArray = new Uint8ClampedArray(targetWidth * targetHeight * 4);
  const xScale = sourceWidth / targetWidth;
  const yScale = sourceHeight / targetHeight;

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(val, max));

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const srcX = x * xScale;
      const srcY = y * yScale;

      const x1 = Math.floor(srcX);
      const y1 = Math.floor(srcY);
      const x2 = Math.ceil(srcX);
      const y2 = Math.ceil(srcY);

      const fx = srcX - x1;
      const fy = srcY - y1;

      const p1Index =
        (clamp(y1, 0, sourceHeight - 1) * sourceWidth +
          clamp(x1, 0, sourceWidth - 1)) *
        4;
      const p2Index =
        (clamp(y1, 0, sourceHeight - 1) * sourceWidth +
          clamp(x2, 0, sourceWidth - 1)) *
        4;
      const p3Index =
        (clamp(y2, 0, sourceHeight - 1) * sourceWidth +
          clamp(x1, 0, sourceWidth - 1)) *
        4;
      const p4Index =
        (clamp(y2, 0, sourceHeight - 1) * sourceWidth +
          clamp(x2, 0, sourceWidth - 1)) *
        4;

      const targetIndex = (y * targetWidth + x) * 4;

      for (let channel = 0; channel < 4; channel++) {
        const val1 = sourceArray[p1Index + channel];
        const val2 = sourceArray[p2Index + channel];
        const val3 = sourceArray[p3Index + channel];
        const val4 = sourceArray[p4Index + channel];

        const interpolatedX1 = val1 * (1 - fx) + val2 * fx;
        const interpolatedX2 = val3 * (1 - fx) + val4 * fx;

        targetArray[targetIndex + channel] = Math.round(
          interpolatedX1 * (1 - fy) + interpolatedX2 * fy
        );
      }
    }
  }

  return targetArray;
}

/**
 * Skaliert ein Bild, das als Uint8ClampedArray vorliegt,
 * unter Verwendung des Bikubischen Interpolations-Algorithmus.
 */
export function resizeImageBicubic(
  sourceArray: Uint8Array,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
) {
  const targetArray = new Uint8ClampedArray(targetWidth * targetHeight * 4);
  const xScale = sourceWidth / targetWidth;
  const yScale = sourceHeight / targetHeight;

  // Bikubische Interpolationsfunktion (Kernel)
  // https://en.wikipedia.org/wiki/Bicubic_interpolation#Cubic_convolution_algorithm
  const bicubicKernel = (x: number) => {
    x = Math.abs(x);
    if (x <= 1) {
      return (1.5 * x - 2.5) * x * x + 1;
    } else if (x <= 2) {
      return ((-0.5 * x + 2.5) * x - 4) * x + 2;
    }
    return 0;
  };

  const getPixelValue = (
    arr: Uint8Array,
    width: number,
    height: number,
    x: number,
    y: number,
    channel: number
  ) => {
    x = Math.round(clamp(x, 0, width - 1));
    y = Math.round(clamp(y, 0, height - 1));
    return arr[(y * width + x) * 4 + channel];
  };

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(val, max));

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const srcX = x * xScale;
      const srcY = y * yScale;

      const xFloor = Math.floor(srcX);
      const yFloor = Math.floor(srcY);

      const dx = srcX - xFloor;
      const dy = srcY - yFloor;

      const targetIndex = (y * targetWidth + x) * 4;

      for (let channel = 0; channel < 4; channel++) {
        let sum = 0;
        for (let j = -1; j <= 2; j++) {
          for (let i = -1; i <= 2; i++) {
            const pixelVal = getPixelValue(
              sourceArray,
              sourceWidth,
              sourceHeight,
              xFloor + i,
              yFloor + j,
              channel
            );
            const weightX = bicubicKernel(dx - i);
            const weightY = bicubicKernel(dy - j);
            sum += pixelVal * weightX * weightY;
          }
        }
        targetArray[targetIndex + channel] = Math.round(clamp(sum, 0, 255));
      }
    }
  }

  return targetArray;
}

/**
 * Skaliert ein Bild, das als Uint8ClampedArray vorliegt,
 * unter Verwendung des Lanczos-3-Interpolations-Algorithmus.
 */
export function resizeImageLanczos(
  sourceArray: Uint8Array,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
) {
  const targetArray = new Uint8ClampedArray(targetWidth * targetHeight * 4);
  const xScale = sourceWidth / targetWidth;
  const yScale = sourceHeight / targetHeight;

  // Der 'a'-Parameter für den Lanczos-Kernel. Üblicherweise 2 oder 3.
  // Lanczos-3 verwendet a = 3, d.h. es werden 3 Pixel auf jeder Seite berücksichtigt (insgesamt 6).
  const a = 3;

  // Lanczos-Kernel-Funktion
  // https://en.wikipedia.org/wiki/Lanczos_resampling#The_Lanczos_kernel
  const lanczosKernel = (x: number) => {
    x = Math.abs(x);
    if (x === 0) return 1;
    if (x >= a) return 0;
    const piX = Math.PI * x;
    return (a * Math.sin(piX) * Math.sin(piX / a)) / (piX * piX);
  };

  // Hilfsfunktion zum Abrufen eines Pixels mit Randbehandlung (Clamping)
  const getPixelValue = (
    arr: Uint8Array,
    width: number,
    height: number,
    x: number,
    y: number,
    channel: number
  ) => {
    x = Math.round(clamp(x, 0, width - 1));
    y = Math.round(clamp(y, 0, height - 1));
    return arr[(y * width + x) * 4 + channel];
  };

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(val, max));

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      // Berechne die entsprechenden Floating-Point-Koordinaten im Originalbild
      const srcX = x * xScale;
      const srcY = y * yScale;

      // Bestimme die ganzzahligen Koordinaten des Zentrums der Nachbarschaft
      const xCenter = Math.floor(srcX);
      const yCenter = Math.floor(srcY);

      const targetIndex = (y * targetWidth + x) * 4;

      for (let channel = 0; channel < 4; channel++) {
        // Für R, G, B, A
        let sum = 0;
        let weightSum = 0; // Für Normalisierung, falls Gewichte nicht perfekt 1 ergeben

        // Schleife über die (2*a) x (2*a) Nachbarschaft der Pixel
        // Für Lanczos-3 (a=3) ist es eine 6x6 Matrix
        for (let j = -a + 1; j <= a; j++) {
          // Vertikale Nachbarn
          for (let i = -a + 1; i <= a; i++) {
            // Horizontale Nachbarn
            const sourcePixelX = xCenter + i;
            const sourcePixelY = yCenter + j;

            const pixelVal = getPixelValue(
              sourceArray,
              sourceWidth,
              sourceHeight,
              sourcePixelX,
              sourcePixelY,
              channel
            );

            const weightX = lanczosKernel(srcX - sourcePixelX);
            const weightY = lanczosKernel(srcY - sourcePixelY);
            const totalWeight = weightX * weightY;

            sum += pixelVal * totalWeight;
            weightSum += totalWeight;
          }
        }
        // Normalisiere den Summenwert
        targetArray[targetIndex + channel] = Math.round(
          clamp(sum / weightSum, 0, 255)
        );
      }
    }
  }

  return targetArray;
}
