import {
  BRUSH_TYPE,
  SHAPE_STYLE,
  TOOLS,
  type BrushSelect,
  type ColorSelect,
  type ToolDescription,
  type ToolSelect
} from '../../types/select';
import Color from '../classes/Color';
import { KEYBOARD_CODE } from '@web-workbench/core/types/dom';
import PaletteColor from '../classes/PaletteColor';
import Palette from '../classes/Palette';

export function getDefaultBrushSelect(): BrushSelect {
  return {
    type: BRUSH_TYPE.CIRCLE,
    size: 1
  };
}

export function getDefaultToolSelect(): ToolSelect {
  return {
    shapeStyle: SHAPE_STYLE.STROKED_FILLED,
    value: TOOLS.NONE,
    segmentLength: 1,
    gapLength: 0,
    interpolateSegments: false,
    density: 1,
    airBrushStrength: 1
  };
}
export function getDefaultColorSelect(): ColorSelect {
  return {
    primaryColor: new PaletteColor({ color: new Color(0, 0, 0) }),
    secondaryColor: new PaletteColor({ color: new Color(255, 0, 0) }),
    palette: new Palette({
      name: 'Default Palette',
      colors: [
        new PaletteColor({ color: new Color(0, 0, 0, 0) }),
        new PaletteColor({ color: new Color(0, 0, 0) }),
        new PaletteColor({ color: new Color(255, 0, 0) }),
        new PaletteColor({ color: new Color(0, 255, 0) }),
        new PaletteColor({ color: new Color(0, 0, 255) })
      ]
    }),
    paletteSteps: new Color(4, 1, 1)
  };
}

export function getBrushSelectOptions() {
  return [
    {
      value: {
        type: BRUSH_TYPE.CIRCLE,
        size: 1
      },
      title: 'Small Circle'
    },
    {
      value: {
        type: BRUSH_TYPE.CIRCLE,
        size: 3
      },
      title: 'Medium Circle'
    },
    {
      value: {
        type: BRUSH_TYPE.CIRCLE,
        size: 5
      },
      title: 'Large Circle'
    },
    {
      value: {
        type: BRUSH_TYPE.CIRCLE,
        size: 7
      },
      title: 'Extra Large Circle'
    },
    {
      value: {
        type: BRUSH_TYPE.SQUARE,
        size: 5
      },
      title: 'Extra Large Square'
    },
    {
      value: {
        type: BRUSH_TYPE.SQUARE,
        size: 4
      },
      title: 'Large Square'
    },
    {
      value: {
        type: BRUSH_TYPE.SQUARE,
        size: 3
      },
      title: 'Medium Square'
    },
    {
      value: {
        type: BRUSH_TYPE.SQUARE,
        size: 2
      },
      title: 'Small Square'
    },
    {
      value: {
        type: BRUSH_TYPE.DOTS,
        size: 4
      },
      title: 'Small Dots'
    },
    {
      value: {
        type: BRUSH_TYPE.DOTS,
        size: 8
      },
      title: 'Medium Dots'
    }
  ];
}

export function getToolSelectOptions({
  shiftActive,
  canRedo,
  canUndo
}: {
  shiftActive?: boolean;
  canRedo?: boolean;
  canUndo?: boolean;
}): ToolDescription[] {
  return [
    {
      value: TOOLS.DOTTED_FREEHAND,
      title: 'Dotted Freehand'
    },
    {
      value: TOOLS.CONTINUOUS_FREEHAND,
      title: 'Continuous Freehand'
    },
    {
      value: TOOLS.STRAIGHT_LINE,
      title: 'Straight Line'
    },
    {
      value: TOOLS.CURVE_LINE,
      title: 'Curve'
    },
    {
      value: TOOLS.FILL_TOOL,
      title: 'Fill Tool'
    },
    {
      value: TOOLS.AIR_BRUSH,
      title: 'Air Brush'
    },
    {
      value: TOOLS.RECTANGLE,
      title: 'Rectangle'
    },
    {
      value: TOOLS.CIRCLE,
      title: 'Circle'
    },
    {
      value: TOOLS.ELLIPSE,
      title: 'Ellipse'
    },
    {
      value: TOOLS.POLYGON,
      title: 'Polygon'
    },
    {
      value: TOOLS.CROP,
      title: 'Brush Selector'
    },
    // {
    //   disabled: true,
    //   value: TOOLS.TEXT,
    //   title: 'Text'
    // },
    {
      passive: true,
      value: TOOLS.SPLIT_SCREEN,
      title: 'Split Screen'
    },
    {
      value: TOOLS.COLOR_PICKER,
      title: 'Color Picker',
      hotKey: {
        code: KEYBOARD_CODE.KEY_I,
        title: 'I'
      }
    },
    {
      passive: true,
      value: TOOLS.ZOOM_FIT,
      title: 'Fit to Screen'
    },
    {
      value: TOOLS.MAGNIFY,
      title: 'Magnify'
    },
    {
      value: TOOLS.ZOOM,
      title: 'Zoom'
    },
    ...(shiftActive
      ? [
          {
            disabled: !canRedo,
            value: TOOLS.STACK_REDO,
            passive: true,
            title: 'Redo'
          }
        ]
      : [
          {
            disabled: !canUndo,
            value: TOOLS.STACK_UNDO,
            passive: true,
            title: 'Undo'
          }
        ]),
    {
      value: TOOLS.CLEAR,
      passive: true,
      title: 'Clear'
    }
  ];
}
