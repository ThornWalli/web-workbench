import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import { CONFIG_NAMES, type ModelSymbol } from '../types';
import {
  INTERACTION_TYPE,
  type ItemModel
} from '@web-workbench/core/classes/MenuItem/Interaction';
import { MenuItemInteraction } from '@web-workbench/core/classes/MenuItem';

export default defineMenuItems<{ model: ModelSymbol & ItemModel }>(
  ({ model }) => {
    return [
      new MenuItemInteraction({
        type: INTERACTION_TYPE.CHECKBOX,
        title: 'Show Symbol Used',
        name: CONFIG_NAMES.SHOW_SYMBOL_USED,
        model
      }),
      new MenuItemInteraction({
        type: INTERACTION_TYPE.CHECKBOX,
        title: 'Show Selected',
        name: CONFIG_NAMES.SHOW_SELECTED,
        model
      })
    ];
  }
);
