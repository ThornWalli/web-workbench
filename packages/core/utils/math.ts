import { ipoint } from '@js-basics/vector';

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export function getRadOfVector(vector: { x: number; y: number }) {
  return Math.atan2(vector.y, vector.x) + Math.PI;
}

export function getRadOfElement(el: HTMLElement) {
  const matrix = window.getComputedStyle(el).transform;
  const m = new DOMMatrix(matrix);
  return Math.atan2(m.b, m.a);
}

// source: https://matthew-brett.github.io/teaching/rotation_2d.html
export function addRadToVector(vector: { x: number; y: number }, rad: number) {
  const x = Math.cos(rad) * vector.x - Math.sin(rad) * vector.y;
  const y = Math.sin(rad) * vector.x + Math.cos(rad) * vector.y;
  return ipoint(x, y);
}
