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
    size: BRUSH_SIZE.SMALL
  };
}
export function getDefaultToolSelect(): ToolSelect {
  return {
    value: TOOLS.CROP
  };
}
export function getDefaultColorSelect(): ColorSelect {
  return {
    primaryColor: new Color(0, 0, 0),
    secondaryColor: new Color(255, 0, 0, 128),
    colors: [
      new Color(0, 0, 0, 0),
      new Color(0, 0, 0),
      new Color(255, 0, 0),
      new Color(0, 255, 0),
      new Color(0, 0, 255)
    ],
    paletteSteps: new Color(4, 1, 1)
  };
}
