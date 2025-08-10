import { MenuItemInteraction } from '@web-workbench/core/classes/MenuItem';
import { FONT_TYPES, PROPERTY } from './types';
import type { DocumentModel } from './types';
import { INTERACTION_TYPE } from '@web-workbench/core/classes/MenuItem/Interaction';
import type { ItemModel } from '@web-workbench/core/classes/MenuItem/Interaction';
import type { MenuItemOptions } from '@web-workbench/core/classes/MenuItem/types';

export function getDefaultConfig() {
  return {
    DOCUMENT_EDITOR_SHOW_PREVIEW: 'workbench13_DOCUMENT_EDITOR_SHOW_PREVIEW'
  };
}

// export const CONFIG_DEFAULTS = {
//   [CONFIG_NAMES.DOCUMENT_EDITOR_SHOW_PREVIEW]: true
// };
export enum BUILDIN {
  'Amiga Topaz 13' = 'Amiga Topaz 13',
  'Amiga Topaz 13 Console' = 'Amiga Topaz 13 Console',
  'BitFont' = 'BitFont'
}

export enum SERIF {
  Georgia = 'Georgia',
  'Palatino Linotype' = 'Palatino Linotype',
  'Times New Roman' = 'Times New Roman'
}
export enum SANS_SERIF {
  Arial = 'Arial',
  'Arial Black' = 'Arial Black',
  'Comic Sans MS' = 'Comic Sans MS',
  Impact = 'Impact',
  Tahoma = 'Tahoma',
  'Trebuchet MS' = 'Trebuchet MS',
  Verdana = 'Verdana'
}
export enum MONOSPACE {
  'Courier New' = 'Courier New',
  'Monospace' = 'Monospace'
}

export enum FONT_FAMILY {
  AMIGA_TOPAZ_13 = 'Amiga Topaz 13',
  AMIGA_TOPAZ_13_CONSOLE = 'Amiga Topaz 13 Console',
  BIT_FONT = 'BitFont',
  GEORGIA = 'Georgia',
  PALATINO_LINOTYPE = 'Palatino Linotype',
  TIMES_NEW_ROMAN = 'Times New Roman',
  ARIAL = 'Arial',
  ARIAL_BLACK = 'Arial Black',
  COMIC_SANS_MS = 'Comic Sans MS',
  IMPACT = 'Impact',
  TAHOMA = 'Tahoma',
  TREBUCHET_MS = 'Trebuchet MS',
  VERDANA = 'Verdana',
  COURIER_NEW = 'Courier New',
  MONOSPACE = 'Monospace'
}

export const FONT_FAMILIES_FLAT = {
  [FONT_FAMILY.AMIGA_TOPAZ_13]: BUILDIN['Amiga Topaz 13'],
  [FONT_FAMILY.AMIGA_TOPAZ_13_CONSOLE]: BUILDIN['Amiga Topaz 13 Console'],
  [FONT_FAMILY.BIT_FONT]: BUILDIN.BitFont,
  [FONT_FAMILY.GEORGIA]: SERIF.Georgia,
  [FONT_FAMILY.PALATINO_LINOTYPE]: SERIF['Palatino Linotype'],
  [FONT_FAMILY.TIMES_NEW_ROMAN]: SERIF['Times New Roman'],
  [FONT_FAMILY.ARIAL]: SANS_SERIF.Arial,
  [FONT_FAMILY.ARIAL_BLACK]: SANS_SERIF['Arial Black'],
  [FONT_FAMILY.COMIC_SANS_MS]: SANS_SERIF['Comic Sans MS'],
  [FONT_FAMILY.IMPACT]: SANS_SERIF.Impact,
  [FONT_FAMILY.TAHOMA]: SANS_SERIF.Tahoma,
  [FONT_FAMILY.TREBUCHET_MS]: SANS_SERIF['Trebuchet MS'],
  [FONT_FAMILY.VERDANA]: SANS_SERIF.Verdana,
  [FONT_FAMILY.COURIER_NEW]: MONOSPACE['Courier New'],
  [FONT_FAMILY.MONOSPACE]: MONOSPACE.Monospace
};

export const FONT_FAMILES = {
  [FONT_TYPES.BuiltIn]: {
    [FONT_FAMILY.AMIGA_TOPAZ_13]:
      FONT_FAMILIES_FLAT[FONT_FAMILY.AMIGA_TOPAZ_13],
    [FONT_FAMILY.AMIGA_TOPAZ_13_CONSOLE]:
      FONT_FAMILIES_FLAT[FONT_FAMILY.AMIGA_TOPAZ_13_CONSOLE],
    [FONT_FAMILY.BIT_FONT]: FONT_FAMILIES_FLAT[FONT_FAMILY.BIT_FONT]
  },
  [FONT_TYPES.Serif]: {
    [FONT_FAMILY.GEORGIA]: FONT_FAMILIES_FLAT[FONT_FAMILY.GEORGIA],
    [FONT_FAMILY.PALATINO_LINOTYPE]:
      FONT_FAMILIES_FLAT[FONT_FAMILY.PALATINO_LINOTYPE],
    [FONT_FAMILY.TIMES_NEW_ROMAN]:
      FONT_FAMILIES_FLAT[FONT_FAMILY.TIMES_NEW_ROMAN]
  },
  [FONT_TYPES.SansSerif]: {
    [FONT_FAMILY.ARIAL]: FONT_FAMILIES_FLAT[FONT_FAMILY.ARIAL],
    [FONT_FAMILY.ARIAL_BLACK]: FONT_FAMILIES_FLAT[FONT_FAMILY.ARIAL_BLACK],
    [FONT_FAMILY.COMIC_SANS_MS]: FONT_FAMILIES_FLAT[FONT_FAMILY.COMIC_SANS_MS],
    [FONT_FAMILY.IMPACT]: FONT_FAMILIES_FLAT[FONT_FAMILY.IMPACT],
    [FONT_FAMILY.TAHOMA]: FONT_FAMILIES_FLAT[FONT_FAMILY.TAHOMA],
    [FONT_FAMILY.TREBUCHET_MS]: FONT_FAMILIES_FLAT[FONT_FAMILY.TREBUCHET_MS],
    [FONT_FAMILY.VERDANA]: FONT_FAMILIES_FLAT[FONT_FAMILY.VERDANA]
  },
  [FONT_TYPES.Monospace]: {
    [FONT_FAMILY.COURIER_NEW]: FONT_FAMILIES_FLAT[FONT_FAMILY.COURIER_NEW],
    [FONT_FAMILY.MONOSPACE]: FONT_FAMILIES_FLAT[FONT_FAMILY.MONOSPACE]
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
): MenuItemOptions[] {
  return Object.entries(typeFonts).map(([title, value]) => {
    return new MenuItemInteraction({
      title,
      type: INTERACTION_TYPE.RADIO,
      name: PROPERTY.FONT_FAMILY,
      value,
      model
    });
  });
}

export function getFontSizeItems(model: DocumentModel & ItemModel) {
  return FONT_SIZES.map((value: number) => {
    return new MenuItemInteraction({
      title: `${value}px`,
      type: INTERACTION_TYPE.RADIO,
      name: PROPERTY.FONT_SIZE,
      value,
      model
    });
  });
}

export function getLineHeightItems(model: DocumentModel & ItemModel) {
  return LINE_HEIGHTS.map((value: number) => {
    return new MenuItemInteraction({
      title: `${value}`,
      type: INTERACTION_TYPE.RADIO,
      name: PROPERTY.LINE_HEIGHT,
      value,
      model
    });
  });
}

export function getModularScaleItems(model: DocumentModel & ItemModel) {
  return Object.values(MODULAR_SCALE).map((title: string) => {
    return new MenuItemInteraction({
      title,
      type: INTERACTION_TYPE.RADIO,
      name: PROPERTY.MODULAR_SCALE,
      value: title,
      model
    });
  });
}
