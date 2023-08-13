export function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function hexToRgb(hex) {
  hex = hex.replace(/ /g, '');
  if (hex.length === 7) {
    return [
      ('0x' + hex[1] + hex[2]) | 0,
      ('0x' + hex[3] + hex[4]) | 0,
      ('0x' + hex[5] + hex[6]) | 0
    ];
  } else {
    return [
      ('0x' + hex[1] + hex[1]) | 0,
      ('0x' + hex[2] + hex[2]) | 0,
      ('0x' + hex[3] + hex[3]) | 0
    ];
  }
}
