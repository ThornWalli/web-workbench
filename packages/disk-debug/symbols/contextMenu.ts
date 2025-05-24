import { defineMenuItems } from '@web-workbench/core/utils/menuItems';
import { MODEL_OPTION, type Model } from './types';
import {
  INTERACTION_TYPE,
  type ItemModel
} from '@web-workbench/core/classes/MenuItem/Interaction';
import { MenuItemInteraction } from '@web-workbench/core/classes/MenuItem';

export default defineMenuItems<{ model: Model & ItemModel }>(({ model }) => {
  return [
    new MenuItemInteraction<MODEL_OPTION, Model>({
      type: INTERACTION_TYPE.CHECKBOX,
      title: 'Show Symbol Used',
      name: MODEL_OPTION.SHOW_SYMBOL_USED,
      model
    }),
    new MenuItemInteraction<MODEL_OPTION, Model>({
      type: INTERACTION_TYPE.CHECKBOX,
      title: 'Show Selected',
      name: MODEL_OPTION.SHOW_SELECTED,
      model
    })
  ];
});
