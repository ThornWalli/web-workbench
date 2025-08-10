import type { IPoint } from '@js-basics/vector';
import { ipoint } from '@js-basics/vector';
import Color from '@web-workbench/core/classes/Color';

// eslint-disable-next-line complexity
export function drawRgbaSlider(
  type: 'red' | 'green' | 'blue' | 'alpha',
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  density: IPoint & number = ipoint(1, 1),
  color: Color = new Color(0, 0, 0, 255)
) {
  if (width <= 0 || height <= 0) return;

  switch (type) {
    case 'red':
      {
        const step = density.y;
        for (let i = 0; i < height; i += step) {
          const r = Math.floor((i / (height - step)) * 255);
          ctx.fillStyle = `rgba(${r}, ${color.g}, ${color.b}, ${color.a})`;
          ctx.fillRect(x, y + i, width, step);
        }
      }
      break;

    case 'green':
      {
        const step = density.y;
        for (let i = 0; i < height; i += step) {
          const g = Math.floor((i / (height - step)) * 255);
          ctx.fillStyle = `rgba(${color.r}, ${g}, ${color.b}, ${color.a})`;
          ctx.fillRect(x, y + i, width, step);
        }
      }
      break;
    case 'blue':
      {
        const step = density.y;
        for (let i = 0; i < height; i += step) {
          const b = Math.floor((i / (height - step)) * 255);
          ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${b}, ${color.a})`;
          ctx.fillRect(x, y + i, width, step);
        }
      }
      break;
    case 'alpha':
      {
        const step = density.y;
        for (let i = 0; i < height; i += step) {
          const a = i / (height - step);
          ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${a})`;
          ctx.fillRect(x, y + i, width, step);
        }
      }
      break;
  }
}

// eslint-disable-next-line complexity
export function drawHslaSlider(
  type: 'hue' | 'saturation' | 'lightness' | 'alpha',
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  density: IPoint & number = ipoint(1, 1),
  color: Color = new Color(0, 0, 0, 255)
) {
  if (width <= 0 || height <= 0) return;

  const [h_, s_, l_] = color.toHsl();
  switch (type) {
    case 'hue':
      {
        const step = density.y;
        for (let i = 0; i < height; i += step) {
          const h = Math.min(i / (height - step), 1) * 360;
          const color = Color.fromHsl(h, s_, l_);
          ctx.fillStyle = color.toHex();
          ctx.fillRect(x, y + i, width, step);
        }
      }
      break;

    case 'saturation':
      {
        const step = density.y;
        for (let i = 0; i < height; i += step) {
          const s = i / height;
          const color = Color.fromHsl(h_, s, l_);
          ctx.fillStyle = color.toHex();
          ctx.fillRect(x, y + i, width, step);
        }
      }
      break;

    case 'lightness':
      {
        const step = density.y;
        for (let i = 0; i < height; i += step) {
          const l = i / (height - step);
          const color = Color.fromHsl(h_, s_, l);
          ctx.fillStyle = color.toHex();
          ctx.fillRect(x, y + i, width, step);
        }
      }
      break;

    case 'alpha':
      {
        const step = density.y;
        for (let i = 0; i < height; i += step) {
          const l = i / (height - step);
          const color = Color.fromHsl(h_, s_, l);
          color.a = Math.round(l * 255);
          ctx.fillStyle = color.toHex();
          ctx.fillRect(x, y + i, width, step);
        }
      }
      break;
  }
}

export function drawSolidColor(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function drawPatternSquares(
  ctx: CanvasRenderingContext2D,
  primaryColor: string = '#000000',
  secondaryColor: string = '#ffffff',
  size: number = 20
) {
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = size * 2;
  patternCanvas.height = size * 2;
  const patternCtx = patternCanvas.getContext('2d');
  if (!patternCtx) return;

  patternCtx.fillStyle = secondaryColor;
  patternCtx.fillRect(0, 0, size * 2, size * 2);
  patternCtx.fillStyle = primaryColor;
  patternCtx.fillRect(0, 0, size, size);
  patternCtx.fillRect(size, size, size, size);

  const pattern = ctx.createPattern(patternCanvas, 'repeat');
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}

export function drawVerticalStrips(
  ctx: CanvasRenderingContext2D,
  primaryColor: string = '#000000',
  secondaryColor: string = '#ffffff',
  size: number = 20
) {
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = size * 2;
  patternCanvas.height = size * 2;
  const patternCtx = patternCanvas.getContext('2d');
  if (!patternCtx) return;

  patternCtx.fillStyle = secondaryColor;
  patternCtx.fillRect(0, 0, size * 2, size * 2);
  patternCtx.fillStyle = primaryColor;
  patternCtx.fillRect(0, 0, size, size * 2);

  const pattern = ctx.createPattern(patternCanvas, 'repeat');
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}

export function drawHorizontalStrips(
  ctx: CanvasRenderingContext2D,
  primaryColor: string = '#000000',
  secondaryColor: string = '#ffffff',
  size: number = 20
) {
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = size * 2;
  patternCanvas.height = size * 2;
  const patternCtx = patternCanvas.getContext('2d');
  if (!patternCtx) return;

  patternCtx.fillStyle = secondaryColor;
  patternCtx.fillRect(0, 0, size * 2, size * 2);
  patternCtx.fillStyle = primaryColor;
  patternCtx.fillRect(0, 0, size * 2, size);

  const pattern = ctx.createPattern(patternCanvas, 'repeat');
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}

export function drawVerticalGradient(
  ctx: CanvasRenderingContext2D,
  startColor: string,
  endColor: string
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function drawHorizontalGradient(
  ctx: CanvasRenderingContext2D,
  startColor: string,
  endColor: string
) {
  const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function drawComplete(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const count = 7;
  const density = ipoint(32, 32);
  drawRgbaSlider(
    'red',
    ctx,
    0,
    0,
    ctx.canvas.width / 4,
    ctx.canvas.height,
    density
  );
  drawRgbaSlider(
    'green',
    ctx,
    ctx.canvas.width / count,
    0,
    ctx.canvas.width / count,
    ctx.canvas.height,
    density
  );
  drawRgbaSlider(
    'blue',
    ctx,
    (ctx.canvas.width * 2) / count,
    0,
    ctx.canvas.width / count,
    ctx.canvas.height,
    density
  );
  drawRgbaSlider(
    'alpha',
    ctx,
    (ctx.canvas.width * 3) / count,
    0,
    ctx.canvas.width / count,
    ctx.canvas.height,
    density
  );

  drawHslaSlider(
    'hue',
    ctx,
    (ctx.canvas.width * 4) / count,
    0,
    ctx.canvas.width / count,
    ctx.canvas.height,
    density,
    new Color(255, 0, 0, 255)
  );
  drawHslaSlider(
    'saturation',
    ctx,
    (ctx.canvas.width * 5) / count,
    0,
    ctx.canvas.width / count,
    ctx.canvas.height,
    density,
    new Color(255, 0, 0, 255)
  );
  drawHslaSlider(
    'lightness',
    ctx,
    (ctx.canvas.width * 6) / count,
    0,
    ctx.canvas.width / count,
    ctx.canvas.height,
    density,
    new Color(255, 0, 0, 255)
  );
  drawHslaSlider(
    'alpha',
    ctx,
    (ctx.canvas.width * 7) / count,
    0,
    ctx.canvas.width / count,
    ctx.canvas.height,
    density,
    new Color(255, 0, 0, 255)
  );
}
