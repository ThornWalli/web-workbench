import { describe, it, expect } from 'vitest';
import { rgbToHex, hexToRgb, normalizeColorHex } from '../../utils/color';

describe('utils - color', () => {
  it('rgbToHex', () => {
    const rgbList = [
      [0, 0, 0],
      [255, 255, 255],
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
      [255, 255, 0],
      [0, 255, 255],
      [255, 0, 255]
    ];
    const hexList = [
      '#000000',
      '#ffffff',
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#ffff00',
      '#00ffff',
      '#ff00ff'
    ];
    for (let i = 0; i < rgbList.length; i++) {
      const rgb = rgbList[Number(i)];
      const hex = hexList[Number(i)];
      expect(rgbToHex(rgb[0], rgb[1], rgb[2])).equal(hex);
    }
  });

  it('hexToRgb', () => {
    const hexList = [
      '#000000',
      '#ffffff',
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#ffff00',
      '#00ffff',
      '#ff00ff'
    ];
    const rgbList = [
      [0, 0, 0],
      [255, 255, 255],
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
      [255, 255, 0],
      [0, 255, 255],
      [255, 0, 255]
    ];
    for (let i = 0; i < hexList.length; i++) {
      const hex = hexList[Number(i)];
      const rgb = rgbList[Number(i)];
      expect(JSON.stringify(hexToRgb(hex))).equal(JSON.stringify(rgb));
    }
  });

  it('normalizeColorHex', () => {
    const shortHexList = [
      '#000',
      '#fff',
      '#f00',
      '#0f0',
      '#00f',
      '#ff0',
      '#0ff',
      '#f0f'
    ];
    const longHexList = [
      '#000000',
      '#ffffff',
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#ffff00',
      '#00ffff',
      '#ff00ff'
    ];
    for (let i = 0; i < shortHexList.length; i++) {
      const shortHex = shortHexList[Number(i)];
      const longHex = longHexList[Number(i)];
      expect(normalizeColorHex(shortHex)).equal(longHex);
    }
  });
});
