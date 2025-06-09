import ZoomTool from '../lib/classes/tool/Zoom';
import MagnifyTool from '../lib/classes/tool/Magnify';
import { TOOLS } from '../types/select';
import ContinuousFreehand from '../lib/classes/tool/ContinuousFreehand';
import DottedFreehand from '../lib/classes/tool/DottedFreehand';
import StackRedo from '../lib/classes/tool/StackRedo';
import StackUndo from '../lib/classes/tool/StackUndo';
import Clear from '../lib/classes/tool/Clear';

const tools = {
  [TOOLS.ZOOM]: ZoomTool,
  [TOOLS.MAGNIFY]: MagnifyTool,
  [TOOLS.CONTINUOUS_FREEHAND]: ContinuousFreehand,
  [TOOLS.DOTTED_FREEHAND]: DottedFreehand,
  [TOOLS.STACK_REDO]: StackRedo,
  [TOOLS.STACK_UNDO]: StackUndo,
  [TOOLS.CLEAR]: Clear
};

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
