import type { IPoint } from '@js-basics/vector';
import type Display from './Display';
import type Mouse from './input/Mouse';
import type Color from './Color';

export type ColorRaw = [number, number, number, number];

export enum COLOR {
  BLACK = 'BLACK',
  WHITE = 'WHITE',
  TRANSPARENT = 'TRANSPARENT'
}

export const COLOR_VALUE: {
  [key in COLOR]: ColorRaw;
} = {
  [COLOR.BLACK]: [0, 0, 0, 255],
  [COLOR.WHITE]: [255, 255, 255, 255],
  [COLOR.TRANSPARENT]: [0, 0, 0, 0]
};

export interface PointerResult {
  events?: boolean;
  save?: boolean;
  render?: boolean;
  revert?: boolean;
}

export interface PointerOptions {
  mouse?: Mouse;
  display?: Display;
}

export interface Options {
  size: { width: number; height: number };
  display: {
    foreground: string;
    background: string;
  };
}

export interface DisplayLayout {
  size: IPoint & number;
}

export interface ColorSelect {
  primaryColor: Color;
  secondaryColor: Color;
  paletteSteps: Color;
}

export interface BrushSelect {
  size?: number;
  index?: number;
}
export interface ToolSelect {
  value?: string;
  index?: number;
  filled?: boolean;
}
