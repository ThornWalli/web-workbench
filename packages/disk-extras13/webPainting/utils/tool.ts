import ZoomTool from '../lib/classes/tool/Zoom';
import MagnifyTool from '../lib/classes/tool/Magnify';
import { TOOLS } from '../types/select';
import ContinuousFreehand from '../lib/classes/tool/ContinuousFreehand';
import DottedFreehand from '../lib/classes/tool/DottedFreehand';
import AirBrush from '../lib/classes/tool/AirBrush';
import StraightLine from '../lib/classes/tool/StraightLine';
import CurveLine from '../lib/classes/tool/CurveLine';
import Rectangle from '../lib/classes/tool/Rectangle';
import StackRedo from '../lib/classes/tool/StackRedo';
import StackUndo from '../lib/classes/tool/StackUndo';
import Clear from '../lib/classes/tool/Clear';
import Ellipse from '../lib/classes/tool/Ellipse';
import Circle from '../lib/classes/tool/Circle';
import Polygon from '../lib/classes/tool/Polygon';
import Fill from '../lib/classes/tool/Fill';
import BrushSelector from '../lib/classes/tool/Crop';

const tools = {
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
  [TOOLS.CROP]: BrushSelector,
  [TOOLS.CLEAR]: Clear
};

// eslint-disable-next-line complexity
export function getTool(tool: TOOLS) {
  switch (tool) {
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

    default:
      throw new Error(`Tool ${tool} is not implemented.`);
  }
}
