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
      title: 'Filled Window',
      name: MODEL_OPTION.FILLED,
      model
    })
  ];
});
