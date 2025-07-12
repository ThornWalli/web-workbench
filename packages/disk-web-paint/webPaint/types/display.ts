import type { IPoint } from '@js-basics/vector';
import type Color from '../lib/classes/Color';

export interface Colors {
  background: Color;
  foreground: Color;
}

export interface PixelGrid {
  color: Color;
  lineWidth: number;
  visibleCount: number;
}
export interface Grid {
  active: boolean;
  colors: {
    primary: Color;
    secondary: Color;
  };
  position: IPoint & number;
  dimension: IPoint & number;
}

export enum DISPLAY_ORIGIN {
  TOP_LEFT = 'top_left',
  TOP_CENTER = 'top_center',
  TOP_RIGHT = 'top_right',
  CENTER_LEFT = 'center_left',
  CENTER = 'center',
  CENTER_RIGHT = 'center_right',
  BOTTOM_LEFT = 'bottom_left',
  BOTTOM_CENTER = 'bottom_center',
  BOTTOM_RIGHT = 'bottom_right'
}

export interface TransferableOptions {
  origin: DISPLAY_ORIGIN;
  position: { x: number; y: number };
  background: string;
  foreground: string;
  density: number;
  precision: number;
}
