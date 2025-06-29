import type { HotKey } from '@web-workbench/core/classes/MenuItem/Interaction';
import type Color from '../lib/classes/Color';
import type PaletteColor from '../lib/classes/PaletteColor';
import type Palette from '../lib/classes/Palette';

export interface ColorSelect {
  primaryColor: PaletteColor;
  secondaryColor: PaletteColor;
  palette: Palette;

  /**
   * @deprecated
   * Use `colors` instead.
   */
  paletteSteps: Color;
}

export interface BrushItem {
  type: BRUSH_TYPE;
  size: BRUSH_SIZE;
}

export interface BrushSelect {
  type: BRUSH_TYPE;
  size: number;
  /**
   * @deprecated
   * Use `size` instead.
   */
  sizeOld?: BRUSH_SIZE;
}

export enum SHAPE_STYLE {
  FILLED = 'filled',
  STROKED = 'stroked',
  STROKED_FILLED = 'stroked_filled'
}

export interface ToolDescription {
  value: TOOLS;
  title: string;
  passive?: boolean;
  disabled?: boolean;
  hotKey?: HotKey;
}

export interface ToolSelect {
  value: TOOLS;
  segmentLength: number;
  gapLength: number;
  shapeStyle?: SHAPE_STYLE;
  interpolateSegments?: boolean;
  airBrushStrength?: number;
  /**
   * @deprecated
   */
  density?: number;
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
  SPLIT_SCREEN = 'splitScreen',
  MAGNIFY = 'magnify',
  ZOOM = 'zoom',
  STACK_REDO = 'stack_redo',
  STACK_UNDO = 'stack_undo',
  CLEAR = 'clear',
  ZOOM_FIT = 'zoom_fit',
  COLOR_PICKER = 'color_picker',
  IMAGE_OPERATION = 'image_operation'
}
