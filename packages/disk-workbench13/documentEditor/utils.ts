import {
  MENU_ITEM_TYPE,
  type ItemModel,
  type MenuItemOption
} from '@web-workbench/core/classes/MenuItem';
import { FONT_TYPES, PROPERTY, type DocumentModel } from './types';

export function getDefaultConfig() {
  return {
    DOCUMENT_EDITOR_SHOW_PREVIEW: 'workbench13_DOCUMENT_EDITOR_SHOW_PREVIEW'
  };
}

// export const CONFIG_DEFAULTS = {
//   [CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW]: true
// };

export const FONT_FAMILES = {
  [FONT_TYPES.BuiltIn]: {
    'Amiga Topaz 13': '"Amiga Topaz 13"',
    'Amiga Topaz 13 Console':
      '"Amiga Topaz 13 Console", "Amiga Topaz 13", sans-serif'
  },
  [FONT_TYPES.Serif]: {
    Georgia: 'Georgia, serif',
    'Palatino Linotype': '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    'Times New Roman': '"Times New Roman", Times, serif'
  },
  [FONT_TYPES.SansSerif]: {
    Arial: 'Arial, Helvetica, sans-serif',
    'Arial Black': '"Arial Black", Gadget, sans-serif',
    'Comic Sans MS': '"Comic Sans MS", cursive, sans-serif',
    Impact: 'Impact, Charcoal, sans-serif',
    'Lucida Sans Unicode': '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
    Tahoma: 'Tahoma, Geneva, sans-serif',
    'Trebuchet MS': '"Trebuchet MS", Helvetica, sans-serif',
    Verdana: 'Verdana, Geneva, sans-serif'
  },
  [FONT_TYPES.Monospace]: {
    'Courier New': '"Courier New", Courier, monospace',
    'Lucida Console': '"Lucida Console", Monaco, monospace'
  }
};

export const FONT_TYPE_TITLES = {
  [FONT_TYPES.BuiltIn]: 'Built-In',
  [FONT_TYPES.Serif]: 'Serif',
  [FONT_TYPES.SansSerif]: 'Sans-Serif',
  [FONT_TYPES.Monospace]: 'Monospace'
};

export enum MODULAR_SCALE {
  MINOR_SECOND = 'Minor Second',
  MAJOR_SECOND = 'Major Second',
  MINOR_THIRD = 'Minor Third',
  MAJOR_THIRD = 'Major Third',
  PERFECT_FOURTH = 'Perfect Fourth',
  AUGMENTED_FOURTH = 'Augmented Fourth',
  PERFECT_FIFTH = 'Perfect Fifth',
  GOLDEN_RATIO = 'Golden Ratio'
}

export const MODULAR_SCALE_VALUES: {
  [key in MODULAR_SCALE]: number;
} = {
  [MODULAR_SCALE.MINOR_SECOND]: 1.067,
  [MODULAR_SCALE.MAJOR_SECOND]: 1.125,
  [MODULAR_SCALE.MINOR_THIRD]: 1.2,
  [MODULAR_SCALE.MAJOR_THIRD]: 1.25,
  [MODULAR_SCALE.PERFECT_FOURTH]: 1.333,
  [MODULAR_SCALE.AUGMENTED_FOURTH]: 1.414,
  [MODULAR_SCALE.PERFECT_FIFTH]: 1.5,
  [MODULAR_SCALE.GOLDEN_RATIO]: 1.618
};

export const FONT_SIZES = [
  8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36
];

export const LINE_HEIGHTS = [1, 1.2, 1.5, 1.6, 1.8, 2];

export const DEFAULT_FONT = FONT_FAMILES[FONT_TYPES.BuiltIn]['Amiga Topaz 13'];
export const DEFAULT_FONT_SIZE = 16;
export const DEFAULT_LINE_HEIGHT = 1.2;
export const DEFAULT_MODULAR_SCALE = MODULAR_SCALE.MAJOR_SECOND;

export function getDefaultDocumentModel() {
  return {
    [PROPERTY.OPEN_MAXIMIZED]: false,
    [PROPERTY.OUTPUT_TYPE]: 'markdown',
    [PROPERTY.CONTENT]: '',
    [PROPERTY.FONT_FAMILY]: DEFAULT_FONT,
    [PROPERTY.FONT_SIZE]: DEFAULT_FONT_SIZE,
    [PROPERTY.LINE_HEIGHT]: DEFAULT_LINE_HEIGHT,
    [PROPERTY.MODULAR_SCALE]: DEFAULT_MODULAR_SCALE
  };
}

export function getFontFamilyItems<T extends object>(
  typeFonts: T,
  model: DocumentModel & ItemModel
): MenuItemOption[] {
  return Object.entries(typeFonts).map(([title, value]) => {
    return {
      title,
      type: MENU_ITEM_TYPE.RADIO,
      name: PROPERTY.FONT_FAMILY,
      value,
      model
    };
  });
}

export function getFontSizeItems(model: DocumentModel & ItemModel) {
  return FONT_SIZES.map((value: number) => {
    return {
      title: `${value}px`,
      type: MENU_ITEM_TYPE.RADIO,
      name: PROPERTY.FONT_SIZE,
      value,
      model
    };
  });
}

export function getLineHeightItems(model: DocumentModel & ItemModel) {
  return LINE_HEIGHTS.map((value: number) => {
    return {
      title: `${value}`,
      type: MENU_ITEM_TYPE.RADIO,
      name: PROPERTY.LINE_HEIGHT,
      value,
      model
    };
  });
}

export function getModularScaleItems(model: DocumentModel & ItemModel) {
  return Object.values(MODULAR_SCALE).map((title: string) => {
    return {
      title,
      type: MENU_ITEM_TYPE.RADIO,
      name: PROPERTY.MODULAR_SCALE,
      value: title,
      model
    };
  });
}
