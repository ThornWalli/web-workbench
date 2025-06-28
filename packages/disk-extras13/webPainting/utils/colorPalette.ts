import Color from '../lib/classes/Color';

export function generateWindows98_256ColorPalette() {
  const palette = [];

  // First 16 VGA Colors
  const vgaColors = [
    [0, 0, 0], // Schwarz
    [128, 0, 0], // Dunkelrot
    [0, 128, 0], // Dunkelgrün
    [128, 128, 0], // Dunkelgelb (Olive)
    [0, 0, 128], // Dunkelblau
    [128, 0, 128], // Dunkelmagenta (Purple)
    [0, 128, 128], // Dunkelcyan (Teal)
    [192, 192, 192], // Hellgrau (Silver)

    [128, 128, 128], // Dunkelgrau
    [255, 0, 0], // Rot
    [0, 255, 0], // Grün
    [255, 255, 0], // Gelb
    [0, 0, 255], // Blau
    [255, 0, 255], // Magenta
    [0, 255, 255], // Cyan
    [255, 255, 255], // Weiß
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  palette.push(...vgaColors);

  // 2. 6x6x6 (216 Colors)
  const levels = [0, 51, 102, 153, 204, 255]; // "Web-Safe"

  for (let r_idx = 0; r_idx < 6; r_idx++) {
    for (let g_idx = 0; g_idx < 6; g_idx++) {
      for (let b_idx = 0; b_idx < 6; b_idx++) {
        const r = levels[r_idx];
        const g = levels[g_idx];
        const b = levels[b_idx];
        palette.push([r, g, b]);
      }
    }
  }

  // Grayscale (24 Farben)
  for (let i = 0; i < 24; i++) {
    const grayValue = 8 + i * 10;
    palette.push([grayValue, grayValue, grayValue]);
  }

  return palette.map(color => new Color(color[0], color[1], color[2]));
}
