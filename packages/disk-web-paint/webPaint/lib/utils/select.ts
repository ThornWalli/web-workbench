import { BRUSH_MODE, BRUSH_TYPE, SHAPE_STYLE, TOOL } from '../../types/select';
import type {
  BrushSelect,
  ColorSelect,
  ToolDescription,
  ToolSelect
} from '../../types/select';
import Color from '../classes/Color';
import { KEYBOARD_CODE } from '@web-workbench/core/types/dom';
import PaletteColor from '../classes/PaletteColor';
import type { SelectOptions } from '../../types/worker/main';
import { getDefaultPalette } from '../../utils/colorPalette';
import type { App } from '../App';
import useI18n from '../../composables/useI18n';

export function getDefaultBrushSelect(): BrushSelect {
  return {
    type: BRUSH_TYPE.CIRCLE,
    size: 1,
    mode: BRUSH_MODE.NORMAL
  };
}

export function getDefaultToolSelect(): ToolSelect {
  return {
    shapeStyle: SHAPE_STYLE.STROKED_FILLED,
    value: TOOL.CONTINUOUS_FREEHAND,
    segmentLength: 1,
    gapLength: 0,
    interpolateSegments: true,
    airBrushStrength: 50,
    airBrushWeight: 0.5
  };
}
export function getDefaultColorSelect(): ColorSelect {
  return {
    primaryColor: new PaletteColor({ color: new Color(0, 0, 0) }),
    secondaryColor: new PaletteColor({ color: new Color(255, 255, 255) }),
    palette: getDefaultPalette()
  };
}

export function getBrushSelectOptions() {
  const { t } = useI18n();
  return [
    {
      value: {
        type: BRUSH_TYPE.CIRCLE,
        size: 1
      },
      title: t(`brush_size.${BRUSH_TYPE.CIRCLE}.small`)
    },
    {
      value: {
        type: BRUSH_TYPE.CIRCLE,
        size: 3
      },
      title: t(`brush_size.${BRUSH_TYPE.CIRCLE}.medium`)
    },
    {
      value: {
        type: BRUSH_TYPE.CIRCLE,
        size: 5
      },
      title: t(`brush_size.${BRUSH_TYPE.CIRCLE}.large`)
    },
    {
      value: {
        type: BRUSH_TYPE.CIRCLE,
        size: 7
      },
      title: t(`brush_size.${BRUSH_TYPE.CIRCLE}.extra_large`)
    },
    {
      value: {
        type: BRUSH_TYPE.SQUARE,
        size: 5
      },
      title: t(`brush_size.${BRUSH_TYPE.SQUARE}.extra_large`)
    },
    {
      value: {
        type: BRUSH_TYPE.SQUARE,
        size: 4
      },
      title: t(`brush_size.${BRUSH_TYPE.SQUARE}.large`)
    },
    {
      value: {
        type: BRUSH_TYPE.SQUARE,
        size: 3
      },
      title: t(`brush_size.${BRUSH_TYPE.SQUARE}.medium`)
    },
    {
      value: {
        type: BRUSH_TYPE.SQUARE,
        size: 2
      },
      title: t(`brush_size.${BRUSH_TYPE.SQUARE}.small`)
    },
    {
      value: {
        type: BRUSH_TYPE.DOTS,
        size: 4
      },
      title: t(`brush_size.${BRUSH_TYPE.DOTS}.small`)
    },
    {
      value: {
        type: BRUSH_TYPE.DOTS,
        size: 8
      },
      title: t(`brush_size.${BRUSH_TYPE.SQUARE}.medium`)
    }
  ];
}

export function getToolSelectOptions({
  app,
  shiftActive,
  canRedo,
  canUndo
}: {
  app: App;
  shiftActive?: boolean;
  canRedo?: boolean;
  canUndo?: boolean;
}): ToolDescription[] {
  const { t } = useI18n();
  return [
    {
      value: TOOL.DOTTED_FREEHAND,
      title: t(`tool.${TOOL.DOTTED_FREEHAND}`),
      hotKey: {
        code: KEYBOARD_CODE.KEY_D,
        title: 'D'
      }
    },
    {
      value: TOOL.CONTINUOUS_FREEHAND,
      title: t(`tool.${TOOL.CONTINUOUS_FREEHAND}`),
      hotKey: {
        code: KEYBOARD_CODE.KEY_B,
        title: 'B'
      }
    },
    {
      value: TOOL.STRAIGHT_LINE,
      title: t(`tool.${TOOL.STRAIGHT_LINE}`)
    },
    {
      value: TOOL.CURVE_LINE,
      title: t(`tool.${TOOL.CURVE_LINE}`)
    },
    {
      value: TOOL.FILL_TOOL,
      title: t(`tool.${TOOL.FILL_TOOL}`),
      hotKey: {
        code: KEYBOARD_CODE.KEY_F,
        title: 'F'
      }
    },
    {
      value: TOOL.AIR_BRUSH,
      title: t(`tool.${TOOL.AIR_BRUSH}`)
    },
    {
      value: TOOL.RECTANGLE,
      title: t(`tool.${TOOL.RECTANGLE}`)
    },
    {
      value: TOOL.CIRCLE,
      title: t(`tool.${TOOL.CIRCLE}`)
    },
    {
      value: TOOL.ELLIPSE,
      title: t(`tool.${TOOL.ELLIPSE}`)
    },
    {
      value: TOOL.POLYGON,
      title: t(`tool.${TOOL.POLYGON}`)
    },
    {
      value: TOOL.COLOR_PICKER,
      title: t(`tool.${TOOL.COLOR_PICKER}`),
      hotKey: {
        code: KEYBOARD_CODE.KEY_I,
        title: 'I'
      }
    },
    {
      value: TOOL.CROP,
      title: t(`tool.${TOOL.CROP}`)
    },
    // {
    //   disabled: true,
    //   value: tool.TEXT,
    //   title: 'Text'
    // },
    // {
    //   passive: true,
    //   value: tool.SPLIT_SCREEN,
    //   title: 'Split Screen'
    // },
    {
      passive: true,
      value: TOOL.GRID,
      title: t(`tool.${TOOL.GRID}`),
      selected: app.currentDisplay?.options.grid.active
    },
    {
      passive: true,
      value: TOOL.ZOOM_FIT,
      title: t(`tool.${TOOL.ZOOM_FIT}`)
    },
    {
      value: TOOL.MAGNIFY,
      title: t(`tool.${TOOL.MAGNIFY}`)
    },
    {
      value: TOOL.ZOOM,
      title: t(`tool.${TOOL.ZOOM}`)
    },
    ...(shiftActive
      ? [
          {
            disabled: !canRedo,
            value: TOOL.STACK_REDO,
            passive: true,
            title: t(`tool.${TOOL.STACK_REDO}`)
          }
        ]
      : [
          {
            disabled: !canUndo,
            value: TOOL.STACK_UNDO,
            passive: true,
            title: t(`tool.${TOOL.STACK_UNDO}`)
          }
        ]),
    {
      value: TOOL.CLEAR,
      passive: true,
      title: t(`tool.${TOOL.CLEAR}`)
    }
  ];
}

export function cloneSelectOptions(
  selectOptions: SelectOptions
): SelectOptions {
  return {
    tool: { ...selectOptions.tool },
    brush: {
      ...selectOptions.brush
    },
    color: {
      primaryColor: selectOptions.color.primaryColor.clone(),
      secondaryColor: selectOptions.color.secondaryColor.clone(),
      palette: selectOptions.color.palette.clone()
    }
  };
}
