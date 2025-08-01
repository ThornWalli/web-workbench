import { TOOL } from '../types/select';

import NoneTool from '../lib/classes/tool/interaction/None';
import ZoomTool from '../lib/classes/tool/interaction/Zoom';
import MagnifyTool from '../lib/classes/tool/interaction/Magnify';
import ContinuousFreehand from '../lib/classes/tool/interaction/ContinuousFreehand';
import DottedFreehand from '../lib/classes/tool/interaction/DottedFreehand';
import AirBrush from '../lib/classes/tool/interaction/AirBrush';
import StraightLine from '../lib/classes/tool/interaction/StraightLine';
import CurveLine from '../lib/classes/tool/interaction/CurveLine';
import Rectangle from '../lib/classes/tool/interaction/Rectangle';
import StackRedo from '../lib/classes/tool/interaction/StackRedo';
import StackUndo from '../lib/classes/tool/interaction/StackUndo';
import Clear from '../lib/classes/tool/interaction/Clear';
import Ellipse from '../lib/classes/tool/interaction/Ellipse';
import Circle from '../lib/classes/tool/interaction/Circle';
import Polygon from '../lib/classes/tool/interaction/Polygon';
import Fill from '../lib/classes/tool/interaction/Fill';
import Crop from '../lib/classes/tool/interaction/Crop';
import ColorPickerTool from '../lib/classes/tool/interaction/ColorPicker';
import ZoomFit from '../lib/classes/tool/interaction/ZoomFit';
import GridTool from '../lib/classes/tool/interaction/Grid';
import SplitScreenTool from '../lib/classes/tool/interaction/SplitScreen';
import EraserTool from '../lib/classes/tool/interaction/Eraser';
import ImageOperation from '../lib/classes/tool/interaction/abstract/ImageOperation';
import type { ImageOperationOptions } from '../lib/classes/tool/interaction/abstract/ImageOperation';
import type { ToolUseOptions } from '../lib/classes/Tool';

const tools = {
  [TOOL.NONE]: NoneTool,
  [TOOL.ZOOM]: ZoomTool,
  [TOOL.MAGNIFY]: MagnifyTool,
  [TOOL.CONTINUOUS_FREEHAND]: ContinuousFreehand,
  [TOOL.STRAIGHT_LINE]: StraightLine,
  [TOOL.CURVE_LINE]: CurveLine,
  [TOOL.DOTTED_FREEHAND]: DottedFreehand,
  [TOOL.AIR_BRUSH]: AirBrush,
  [TOOL.RECTANGLE]: Rectangle,
  [TOOL.CIRCLE]: Circle,
  [TOOL.ELLIPSE]: Ellipse,
  [TOOL.POLYGON]: Polygon,
  [TOOL.STACK_REDO]: StackRedo,
  [TOOL.STACK_UNDO]: StackUndo,
  [TOOL.FILL_TOOL]: Fill,
  [TOOL.CROP]: Crop,
  [TOOL.CLEAR]: Clear,
  [TOOL.ZOOM_FIT]: ZoomFit,
  [TOOL.COLOR_PICKER]: ColorPickerTool,
  [TOOL.GRID]: GridTool,
  [TOOL.SPLIT_SCREEN]: SplitScreenTool,
  [TOOL.ERASER]: EraserTool
};

const abstractTools = {
  [TOOL.IMAGE_OPERATION]: ImageOperation
};

export function getAbstractTool(tool: TOOL) {
  switch (tool) {
    case TOOL.IMAGE_OPERATION:
      return abstractTools[TOOL.IMAGE_OPERATION];
    default:
      throw new Error(`Tool ${tool} is not implemented.`);
  }
}

export type AbstractToolOptions = ImageOperationOptions | ToolUseOptions;

// eslint-disable-next-line complexity
export function getTool(tool: TOOL) {
  switch (tool) {
    case TOOL.NONE:
      return tools[TOOL.NONE];
    case TOOL.ZOOM:
      return tools[TOOL.ZOOM];
    case TOOL.MAGNIFY:
      return tools[TOOL.MAGNIFY];
    case TOOL.CONTINUOUS_FREEHAND:
      return tools[TOOL.CONTINUOUS_FREEHAND];
    case TOOL.DOTTED_FREEHAND:
      return tools[TOOL.DOTTED_FREEHAND];
    case TOOL.STRAIGHT_LINE:
      return tools[TOOL.STRAIGHT_LINE];
    case TOOL.CURVE_LINE:
      return tools[TOOL.CURVE_LINE];
    case TOOL.AIR_BRUSH:
      return tools[TOOL.AIR_BRUSH];
    case TOOL.RECTANGLE:
      return tools[TOOL.RECTANGLE];
    case TOOL.CIRCLE:
      return tools[TOOL.CIRCLE];
    case TOOL.ELLIPSE:
      return tools[TOOL.ELLIPSE];
    case TOOL.POLYGON:
      return tools[TOOL.POLYGON];
    case TOOL.FILL_TOOL:
      return tools[TOOL.FILL_TOOL];
    case TOOL.CROP:
      return tools[TOOL.CROP];
    case TOOL.STACK_REDO:
      return tools[TOOL.STACK_REDO];
    case TOOL.STACK_UNDO:
      return tools[TOOL.STACK_UNDO];
    case TOOL.CLEAR:
      return tools[TOOL.CLEAR];
    case TOOL.ZOOM_FIT:
      return tools[TOOL.ZOOM_FIT];
    case TOOL.COLOR_PICKER:
      return tools[TOOL.COLOR_PICKER];
    case TOOL.SPLIT_SCREEN:
      return tools[TOOL.SPLIT_SCREEN];
    case TOOL.GRID:
      return tools[TOOL.GRID];
    case TOOL.ERASER:
      return tools[TOOL.ERASER];

    default:
      throw new Error(`Tool ${tool} is not implemented.`);
  }
}

export function getToolComponent(tool: TOOL) {
  switch (tool) {
    case TOOL.COLOR_PICKER:
      return () => import('../components/tool/ColorPicker.vue');
    case TOOL.ELLIPSE:
      return () => import('../components/tool/Placement.vue');
    case TOOL.CIRCLE:
      return () => import('../components/tool/Placement.vue');
    case TOOL.RECTANGLE:
      return () => import('../components/tool/Placement.vue');
    case TOOL.CROP:
      return () => import('../components/tool/Crop.vue');
  }
}
