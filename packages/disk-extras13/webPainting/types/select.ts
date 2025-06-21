import type { Color } from '../lib/classes/Color';

export interface ColorSelect {
  primaryColor: Color;
  secondaryColor: Color;
  colors: Color[];

  /**
   * @deprecated
   * Use `colors` instead.
   */
  paletteSteps: Color;
}

export interface BrushSelect {
  type: BRUSH_TYPE;
  size: BRUSH_SIZE;
}
export interface ToolSelect {
  value: TOOLS;
  filled?: boolean;
}

export enum BRUSH_SIZE {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  XLARGE = 'xLarge'
}

export enum BRUSH_TYPE {
  CIRCLE = 'circle',
  SQUARE = 'square',
  DOTS = 'dots'
}

export enum TOOLS {
  DOTTED_FREEHAND = 'dotted_freehand',
  CONTINUOUS_FREEHAND = 'continuous_freehand',
  STRAIGHT_LINE = 'straight_line',
  CURVE_LINE = 'curve_line',
  FILL_TOOL = 'fill_tool',
  AIR_BRUSH = 'airbrush',
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  ELLIPSE = 'ellipse',
  POLYGON = 'polygon',
  CROP = 'crop',
  TEXT = 'text',
  GRID = 'grid',
  SYMMETRY = 'symmetry',
  MAGNIFY = 'magnify',
  ZOOM = 'zoom',
  STACK_REDO = 'stack_redo',
  STACK_UNDO = 'stack_undo',
  CLEAR = 'clear'
}
