import type { Color } from '../lib/classes/Color';

export interface ColorSelect {
  primaryColor: Color;
  secondaryColor: Color;
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
  CURVE = 'curve',
  FILL_TOOL = 'fill_tool',
  AIR_BRUSH = 'airbrush',
  UNFILLED_FILLED_RECTANGLE = 'unfilled_filled_rectangle',
  UNFILLED_FILLED_CIRCLE = 'unfilled_filled_circle',
  UNFILLED_FILLED_ELLIPSE = 'unfilled_filled_ellipse',
  UNFILLED_FILLED_POLYGON = 'unfilled_filled_polygon',
  BRUSH_SELECTOR = 'brush_selector',
  TEXT = 'text',
  GRID = 'grid',
  SYMMETRY = 'symmetry',
  MAGNIFY = 'magnify',
  ZOOM = 'zoom',
  STACK_REDO = 'stack_redo',
  STACK_UNDO = 'stack_undo',
  CLEAR = 'clear'
}
