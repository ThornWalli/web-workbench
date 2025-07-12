import { BRUSH_MODE } from '../types/select';

export default {
  brush_mode: {
    [BRUSH_MODE.NORMAL]: 'Normal',
    [BRUSH_MODE.REPLACE]: 'Replace',
    [BRUSH_MODE.MULTIPLY]: 'Multiply',
    [BRUSH_MODE.SCREEN]: 'Screen',
    [BRUSH_MODE.OVERLAY]: 'Overlay',
    [BRUSH_MODE.SOFT_LIGHT]: 'Soft Light',
    [BRUSH_MODE.HARD_LIGHT]: 'Hard Light',
    [BRUSH_MODE.DIFFERENCE]: 'Difference',
    [BRUSH_MODE.EXCLUSION]: 'Exclusion',
    [BRUSH_MODE.COLOR_BURN]: 'Color Burn',
    [BRUSH_MODE.LINEAR_BURN]: 'Linear Burn',
    [BRUSH_MODE.COLOR_DODGE]: 'Color Dodge',
    [BRUSH_MODE.LINEAR_DODGE]: 'Linear Dodge',
    [BRUSH_MODE.VIVID_LIGHT]: 'Vivid Light',
    [BRUSH_MODE.LINEAR_LIGHT]: 'Linear Light',
    [BRUSH_MODE.PIN_LIGHT]: 'Pin Light',
    [BRUSH_MODE.HARD_MIX]: 'Hard Mix',
    [BRUSH_MODE.SUBSTRACT]: 'Substract',
    [BRUSH_MODE.DIVIDE]: 'Divide'
  }
};
