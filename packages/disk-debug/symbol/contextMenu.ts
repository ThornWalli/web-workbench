import {
  defineMenuItems,
  MENU_ITEM_TYPE,
  type ItemModel
} from '@web-workbench/core/classes/MenuItem';
import { CONFIG_NAMES, type ModelSymbol } from '../types';

export default defineMenuItems<{ model: ModelSymbol & ItemModel }>(
  ({ model }) => {
    return [
      {
        type: MENU_ITEM_TYPE.CHECKBOX,
        title: 'Show Symbol Used',
        name: CONFIG_NAMES.SHOW_SYMBOL_USED,
        model
      },
      {
        type: MENU_ITEM_TYPE.CHECKBOX,
        title: 'Show Selected',
        name: CONFIG_NAMES.SHOW_SELECTED,
        model
      }
    ];
  }
);
