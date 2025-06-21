import { Color } from '../lib/classes/Color';
import { hslToRgb } from './color';

export function drawColorWheelCircleArc(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  const radius = size / 2; // Radius des Farbkreises
  if (radius <= 0) return;

  for (let i = 0; i <= 360; i++) {
    // const angle = (i * Math.PI) / 180;
    const startAngle = ((i - 1) * Math.PI) / 180;
    const endAngle = (i * Math.PI) / 180;

    const rgb = hsvToRgb(i, 1, 1); // Volle Sättigung und Helligkeit für den Farbtonkreis
    ctx.beginPath();
    ctx.moveTo(x + size / 2, y + size / 2);
    ctx.arc(x + size / 2, y + size / 2, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    ctx.fill();
  }
}

export function drawColorWheelCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  density = 1
) {
  if (density === 1) {
    return drawColorWheelCircleArc(ctx, x, y, size);
  }

  const radius = size / 2;

  if (radius <= 0) return;

  for (let py = 0; py < size; py += density) {
    for (let px = 0; px < size; px += density) {
      const dx = px + density / 2 - radius;
      const dy = py + density / 2 - radius;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= radius) {
        let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        if (angle < 0) {
          angle += 360;
        }

        const rgb = hsvToRgb(angle, 1, 1);
        ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
        ctx.fillRect(
          Math.round(x + px),
          Math.round(y + py),
          Math.round(density),
          Math.round(density)
        );
      }
    }
  }
}

export function drawColorWheelSquare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  density = 1
) {
  const size = width / density;
  if (size <= 0) return;

  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const hue = (i / size - 1) * 360;
      const saturation = 1 - j / size;
      const lightness = 0.5;

      const rgb = hslToRgb(hue, saturation, lightness);
      ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
      ctx.fillRect(x + i * density, y + j * density, density, density);
    }
  }
}

function hsvToRgb(h: number, s: number, v: number) {
  let r, g, b;
  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
    default:
      r = 0;
      g = 0;
      b = 0;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export function getPixelColorFromCanvas(
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): Color {
  if (x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) {
    return new Color(0, 0, 0, 0);
  }
  const pixelData = ctx.getImageData(
    x * window.devicePixelRatio,
    y * window.devicePixelRatio,
    1,
    1
  ).data;

  const r = pixelData[0];
  const g = pixelData[1];
  const b = pixelData[2];
  const a = pixelData[3];

  return new Color(r, g, b, a);
}

// eslint-disable-next-line complexity
export function drawRgbaSlider(
  type: 'red' | 'green' | 'blue' | 'alpha',
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  density: number = 1,
  color: Color = new Color(0, 0, 0, 255)
) {
  if (width <= 0 || height <= 0) return;

  switch (type) {
    case 'red':
      {
        const step = density;
        for (let i = 0; i < height; i += step) {
          const r = Math.floor((i / (height - step)) * 255);
          ctx.fillStyle = `rgba(${r}, ${color.g}, ${color.b}, ${color.a})`;
          ctx.fillRect(x, y + i, width, step);
        }
      }
      break;

    case 'green':
      {
        const step = density;
        for (let i = 0; i < height; i += step) {
          const g = Math.floor((i / (height - step)) * 255);
          ctx.fillStyle = `rgba(${color.r}, ${g}, ${color.b}, ${color.a})`;
          ctx.fillRect(x, y + i, width, step);
        }
      }
      break;
    case 'blue':
      {
        const step = density;
        for (let i = 0; i < height; i += step) {
          const b = Math.floor((i / (height - step)) * 255);
          ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${b}, ${color.a})`;
          ctx.fillRect(x, y + i, width, step);
        }
      }
      break;
    case 'alpha':
      {
        const step = density;
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
  density: number = 1,
  color: Color = new Color(0, 0, 0, 255)
) {
  if (width <= 0 || height <= 0) return;

  const [h_, s_, l_] = color.toHsl();
  switch (type) {
    case 'hue':
      {
        const step = density;
        for (let i = 0; i < height; i += step) {
          const h = (i / (height - step)) * 360;
          const color = Color.fromHsl(h, s_, l_);
          ctx.fillStyle = color.toHex();
          ctx.fillRect(x, y + i, width, step);
        }
      }
      break;

    case 'saturation':
      {
        const step = density;
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
        const step = density;
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
        const step = density;
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

export function drawColorWheelSquareExtend(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  density = 1,
  color: Color = new Color(255, 0, 0, 255)
) {
  const size = width / density;
  if (size <= 0) return;

  const fixedHue = color.toHsv()[0];

  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const saturation = 1 - j / (size - 1);

      const value = i / (size - 1);

      const rgb = hsvToRgb(fixedHue, saturation, value);
      ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
      ctx.fillRect(x + i * density, y + j * density, density, density);
    }
  }
}
