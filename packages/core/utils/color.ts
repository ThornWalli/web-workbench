export function rgbToHex(r: number = 0, g: number = 0, b: number = 0) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function hexToRgb(hex: string) {
  hex = hex.replace(/ /g, '');
  if (hex.length === 7) {
    return [
      parseInt('0x' + hex[1] + hex[2]),
      parseInt('0x' + hex[3] + hex[4]),
      parseInt('0x' + hex[5] + hex[6])
    ];
  } else {
    return [
      parseInt('0x' + hex[1] + hex[1]),
      parseInt('0x' + hex[2] + hex[2]),
      parseInt('0x' + hex[3] + hex[3])
    ];
  }
}

export function normalizeColorHex(hex: string) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    return (
      '#' +
      hex
        .split('')
        .map(char => {
          // const char = String(parseInt(v, 16));
          return `${char}${char}`;
        })
        .join('')
    );
  } else if (hex.length === 6) {
    return '#' + hex;
  }
  return '#000000';
}
