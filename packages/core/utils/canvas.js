import { normalizeColorHex } from './color';

export function pixelratedCanvas(ctx, ignoredColors = ['#000000']) {
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
  ctx.putImageData(imageData, 0, 0);
}
