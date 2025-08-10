import type * as THREE from 'three';
import type Color from './classes/Color';

export interface GroundType {
  id: string;
  name: string;
  test: (color: Color) => boolean;
  color: THREE.Color;
}
