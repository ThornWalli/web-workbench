import { TOOLS } from '../types/select';

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
import SplitScreenTool from '../lib/classes/tool/interaction/SplitScreen';
import ImageOperation, {
  type ImageOperationOptions
} from '../lib/classes/tool/interaction/ImageOperation';
import type { ToolUseOptions } from '../lib/classes/Tool';

const tools = {
  [TOOLS.NONE]: NoneTool,
  [TOOLS.ZOOM]: ZoomTool,
  [TOOLS.MAGNIFY]: MagnifyTool,
  [TOOLS.CONTINUOUS_FREEHAND]: ContinuousFreehand,
  [TOOLS.STRAIGHT_LINE]: StraightLine,
  [TOOLS.CURVE_LINE]: CurveLine,
  [TOOLS.DOTTED_FREEHAND]: DottedFreehand,
  [TOOLS.AIR_BRUSH]: AirBrush,
  [TOOLS.RECTANGLE]: Rectangle,
  [TOOLS.CIRCLE]: Circle,
  [TOOLS.ELLIPSE]: Ellipse,
  [TOOLS.POLYGON]: Polygon,
  [TOOLS.STACK_REDO]: StackRedo,
  [TOOLS.STACK_UNDO]: StackUndo,
  [TOOLS.FILL_TOOL]: Fill,
  [TOOLS.CROP]: Crop,
  [TOOLS.CLEAR]: Clear,
  [TOOLS.ZOOM_FIT]: ZoomFit,
  [TOOLS.COLOR_PICKER]: ColorPickerTool,
  [TOOLS.SPLIT_SCREEN]: SplitScreenTool
};

const abstractTools = {
  [TOOLS.IMAGE_OPERATION]: ImageOperation
};

export function getAbstractTool(tool: TOOLS) {
  switch (tool) {
    case TOOLS.IMAGE_OPERATION:
      return abstractTools[TOOLS.IMAGE_OPERATION];
    default:
      throw new Error(`Tool ${tool} is not implemented.`);
  }
}

export type AbstractToolOptions = ImageOperationOptions | ToolUseOptions;

// eslint-disable-next-line complexity
export function getTool(tool: TOOLS) {
  switch (tool) {
    case TOOLS.NONE:
      return tools[TOOLS.NONE];
    case TOOLS.ZOOM:
      return tools[TOOLS.ZOOM];
    case TOOLS.MAGNIFY:
      return tools[TOOLS.MAGNIFY];
    case TOOLS.CONTINUOUS_FREEHAND:
      return tools[TOOLS.CONTINUOUS_FREEHAND];
    case TOOLS.DOTTED_FREEHAND:
      return tools[TOOLS.DOTTED_FREEHAND];
    case TOOLS.STRAIGHT_LINE:
      return tools[TOOLS.STRAIGHT_LINE];
    case TOOLS.CURVE_LINE:
      return tools[TOOLS.CURVE_LINE];
    case TOOLS.AIR_BRUSH:
      return tools[TOOLS.AIR_BRUSH];
    case TOOLS.RECTANGLE:
      return tools[TOOLS.RECTANGLE];
    case TOOLS.CIRCLE:
      return tools[TOOLS.CIRCLE];
    case TOOLS.ELLIPSE:
      return tools[TOOLS.ELLIPSE];
    case TOOLS.POLYGON:
      return tools[TOOLS.POLYGON];
    case TOOLS.FILL_TOOL:
      return tools[TOOLS.FILL_TOOL];
    case TOOLS.CROP:
      return tools[TOOLS.CROP];
    case TOOLS.STACK_REDO:
      return tools[TOOLS.STACK_REDO];
    case TOOLS.STACK_UNDO:
      return tools[TOOLS.STACK_UNDO];
    case TOOLS.CLEAR:
      return tools[TOOLS.CLEAR];
    case TOOLS.ZOOM_FIT:
      return tools[TOOLS.ZOOM_FIT];
    case TOOLS.COLOR_PICKER:
      return tools[TOOLS.COLOR_PICKER];
    case TOOLS.SPLIT_SCREEN:
      return tools[TOOLS.SPLIT_SCREEN];

    default:
      throw new Error(`Tool ${tool} is not implemented.`);
  }
}
