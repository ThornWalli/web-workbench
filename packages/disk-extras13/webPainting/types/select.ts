import type { Color } from '../lib/classes/Color';

export interface ColorSelect {
  primaryColor: Color;
  secondaryColor: Color;
  paletteSteps: Color;
}

export interface BrushSelect {
  size: number;
  index: number;
}
export interface ToolSelect {
  value: TOOLS;
  index: number;
  filled?: boolean;
}

export enum BRUSH_SIZE {
  SMALL = 1,
  MEDIUM = 2,
  LARGE = 3,
  XLARGE = 4
}

export enum BRUSH_TYPE {
  ROUND = 0,
  SQUARE = 1,
  SPRINKLE = 2
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
  UNDO_LAST_PAINTING_ACTION = 'undo_last_painting_action',
  CLEAR = 'clear'
}
