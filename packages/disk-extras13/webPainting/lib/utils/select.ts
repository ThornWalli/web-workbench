import {
  BRUSH_SIZE,
  BRUSH_TYPE,
  TOOLS,
  type BrushSelect,
  type ColorSelect,
  type ToolSelect
} from '../../types/select';
import { Color } from '../classes/Color';

export function getDefaultBrushSelect(): BrushSelect {
  return {
    type: BRUSH_TYPE.CIRCLE,
    size: BRUSH_SIZE.XLARGE
  };
}
export function getDefaultToolSelect(): ToolSelect {
  return {
    value: TOOLS.CONTINUOUS_FREEHAND
  };
}
export function getDefaultColorSelect(): ColorSelect {
  return {
    primaryColor: new Color(0, 0, 0),
    secondaryColor: new Color(255, 255, 255),
    paletteSteps: new Color(2, 1, 1)
  };
}
