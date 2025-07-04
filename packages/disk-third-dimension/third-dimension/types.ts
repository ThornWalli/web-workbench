import type Color from '@web-workbench/core/classes/Color';
import type * as THREE from 'three';

export interface GroundType {
  id: string;
  name: string;
  test: (color: Color) => boolean;
  color: THREE.Color;
}
