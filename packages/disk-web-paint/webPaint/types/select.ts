import type { HotKey } from '@web-workbench/core/classes/MenuItem/Interaction';
import type PaletteColor from '../lib/classes/PaletteColor';
import type Palette from '../lib/classes/Palette';

export interface ColorSelect {
  primaryColor: PaletteColor;
  secondaryColor: PaletteColor;
  palette: Palette;
}

export interface BrushItem {
  type: BRUSH_TYPE;
  size: BRUSH_SIZE;
}

export enum BRUSH_MODE {
  NORMAL = 'normal',
  REPLACE = 'replace',
  MULTIPLY = 'multiply',
  SCREEN = 'screen',
  OVERLAY = 'overlay',
  SOFT_LIGHT = 'soft_light',
  HARD_LIGHT = 'hard_light',
  DIFFERENCE = 'difference',
  EXCLUSION = 'exclusion',
  COLOR_BURN = 'color_burn',
  LINEAR_BURN = 'linear_burn',
  COLOR_DODGE = 'color_dodge',
  LINEAR_DODGE = 'linear_dodge',
  VIVID_LIGHT = 'vivid_light',
  LINEAR_LIGHT = 'linear_light',
  PIN_LIGHT = 'pin_light',
  HARD_MIX = 'hard_mix',
  SUBSTRACT = 'substract',
  DIVIDE = 'divide'
}

export interface BrushSelect {
  type: BRUSH_TYPE;
  size: number;
  mode: BRUSH_MODE;
}

export enum SHAPE_STYLE {
  FILLED = 'filled',
  STROKED = 'stroked',
  STROKED_FILLED = 'stroked_filled'
}

export interface ToolDescription {
  hidden?: boolean;
  value: TOOL;
  title: string;
  selected?: boolean;
  passive?: boolean;
  disabled?: boolean;
  hotKey?: HotKey;
}

export interface ToolSelect {
  value: TOOL;
  segmentLength: number;
  gapLength: number;
  shapeStyle?: SHAPE_STYLE;
  interpolateSegments: boolean;
  airBrushStrength: number;
  airBrushWeight: number;
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

export enum TOOL {
  NONE = 'none',
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
  SPLIT_SCREEN = 'splitScreen',
  MAGNIFY = 'magnify',
  ZOOM = 'zoom',
  STACK_REDO = 'stack_redo',
  STACK_UNDO = 'stack_undo',
  CLEAR = 'clear',
  ZOOM_FIT = 'zoom_fit',
  COLOR_PICKER = 'color_picker',
  IMAGE_OPERATION = 'image_operation',
  ERASER = 'eraser'
}

export enum STROKE_ALIGN {
  CENTER,
  INSIDE,
  OUTSIDE
}
