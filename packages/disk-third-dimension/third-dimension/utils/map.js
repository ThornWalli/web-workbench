import MapDescription from '../classes/MapDescription';
import * as THREE from 'three';

export const loadMap = async (depthSrc, typeSrc) => {
  const depthImage = await loadImage(depthSrc);
  const typeImage = await loadImage(typeSrc);

  return new MapDescription(
    getDepthMatrix(depthImage),
    getTypeMatrix(typeImage),
    depthImage.width,
    depthImage.height,
    0.2
  );
};

const loadImage = async src =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const getCanvas = image => {
  const canvas = document.createElement('canvas');
  const scale = 1;
  canvas.width = image.width * scale;
  canvas.height = image.height * scale;
  const context = canvas.getContext('2d');
  context.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    0,
    0,
    image.width * scale,
    image.height * scale
  );
  return canvas;
};

const getDepthMatrix = depthImage => {
  const canvas = getCanvas(depthImage);
  const context = canvas.getContext('2d');
  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
  return Array(canvas.width * canvas.height)
    .fill()
    .map((_, x) => {
      const y = Math.floor(x / canvas.width);
      x = x % canvas.width;
      const color = Color.fromImageData(data, (y * canvas.width + x) * 4);
      return (color.r - 256 / 2) / 15;
    });
};

const getTypeMatrix = typeImage => {
  const canvas = getCanvas(typeImage);
  const context = canvas.getContext('2d');
  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;

  return Array(canvas.width * canvas.height)
    .fill()
    .map((_, x) => {
      const y = Math.floor(x / canvas.width);
      x = x % canvas.width;
      const color = Color.fromImageData(data, (y * canvas.width + x) * 4);
      return Object.values(TYPES).find(type => type.test(color));
    });
};

const TYPES = {
  GRAS: {
    id: 'gras',
    name: 'GRAS',
    test: color => color.r === 0 && color.g === 255 && color.b === 0,
    color: new THREE.Color(0, 1, 0)
  },
  STONE: {
    id: 'stone',
    name: 'STONE',
    test: color => color.r === 204 && color.g === 204 && color.b === 204,
    color: new THREE.Color(0.129, 0.129, 0.129)
  },
  WATER: {
    id: 'water',
    name: 'Water',
    test: color => color.r === 0 && color.g === 0 && color.b === 255,
    color: new THREE.Color(0, 0, 1)
  }
};

class Color {
  constructor(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static fromImageData(data, i) {
    return new Color(data[i], data[i + 1], data[i + 2], data[i + 3]);
  }
}
