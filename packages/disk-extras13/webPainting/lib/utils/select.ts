import {
  TOOLS,
  type BrushSelect,
  type ColorSelect,
  type ToolSelect
} from '../../types/select';
import { Color } from '../classes/Color';

export function getDefaultBrushSelect(): BrushSelect {
  return {
    index: -1,
    size: 1
  };
}
export function getDefaultToolSelect(): ToolSelect {
  return {
    index: -1,
    value: TOOLS.ZOOM
  };
}
export function getDefaultColorSelect(): ColorSelect {
  return {
    primaryColor: new Color(0, 0, 0),
    secondaryColor: new Color(255, 255, 255),
    paletteSteps: new Color(2, 1, 1)
  };
}
